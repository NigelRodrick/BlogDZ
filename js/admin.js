/**
 * Author helper: build a BLOG_POSTS entry for pasting into content.js.
 * Does not upload to a server—copy the output and paste into content.js, then deploy.
 */
(function () {
  "use strict";

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function todayISO() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function getFormData() {
    var title = (document.getElementById("f-title") || {}).value || "";
    var slugRaw = (document.getElementById("f-slug") || {}).value || "";
    var slug = slugRaw.trim() || slugify(title);
    var published =
      (document.getElementById("f-date") || {}).value || todayISO();
    var author =
      (document.getElementById("f-author") || {}).value ||
      "Dellar Zvinavashe";
    var kicker = (document.getElementById("f-kicker") || {}).value || "";
    var excerpt = (document.getElementById("f-excerpt") || {}).value || "";
    var body = (document.getElementById("f-body") || {}).value || "";
    var image = (document.getElementById("f-image") || {}).value || "";
    var readRaw = (document.getElementById("f-read") || {}).value;
    var readMinutes =
      readRaw === "" || readRaw == null
        ? null
        : Math.max(1, parseInt(readRaw, 10) || 1);

    return {
      slug: slug,
      title: title.trim(),
      published: published,
      author: author.trim(),
      kicker: kicker.trim(),
      excerpt: excerpt.trim(),
      body: body.trim(),
      image: image.trim(),
      readMinutes: readMinutes,
    };
  }

  function buildPostObject(post) {
    var o = {
      slug: post.slug,
      title: post.title,
      published: post.published,
      author: post.author,
      kicker: post.kicker,
      image: post.image,
      excerpt: post.excerpt,
      body: post.body,
    };
    if (post.readMinutes != null) {
      o.readMinutes = post.readMinutes;
    }
    return o;
  }

  /** Match content.js shape: template literal for body */
  function formatForContentJs(post) {
    var p = buildPostObject(post);
    var bodyEscaped = String(p.body).replace(/\\/g, "\\\\").replace(/`/g, "\\`");
    var lines = [];
    lines.push("  {");
    lines.push('    slug: "' + escapeStr(p.slug) + '",');
    lines.push("    title: " + JSON.stringify(p.title) + ",");
    lines.push('    published: "' + escapeStr(p.published) + '",');
    lines.push("    author: " + JSON.stringify(p.author) + ",");
    lines.push("    kicker: " + JSON.stringify(p.kicker) + ",");
    lines.push("    image: " + JSON.stringify(p.image) + ",");
    if (p.readMinutes != null) {
      lines.push("    readMinutes: " + p.readMinutes + ",");
    }
    lines.push("    excerpt:");
    lines.push("      " + JSON.stringify(p.excerpt) + ",");
    lines.push("    body: `");
    lines.push(bodyEscaped);
    lines.push("    `,");
    lines.push("  },");
    return lines.join("\n");
  }

  function escapeStr(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function runGenerate() {
    var post = getFormData();
    if (!post.title) {
      alert("Please enter a title.");
      return;
    }
    if (!post.slug) {
      alert("Could not build a slug—add a title or slug.");
      return;
    }
    var out = formatForContentJs(post);
    var pre = document.getElementById("admin-output");
    if (pre) {
      pre.textContent = out;
    }
    var wrap = document.getElementById("admin-output-wrap");
    if (wrap) {
      wrap.hidden = false;
    }
  }

  function runCopy() {
    var pre = document.getElementById("admin-output");
    if (!pre || !pre.textContent) {
      alert("Generate code first.");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pre.textContent).then(
        function () {
          var btn = document.getElementById("btn-copy");
          if (btn) {
            var t = btn.textContent;
            btn.textContent = "Copied!";
            setTimeout(function () {
              btn.textContent = t;
            }, 2000);
          }
        },
        function () {
          fallbackCopy(pre.textContent);
        }
      );
    } else {
      fallbackCopy(pre.textContent);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      alert("Copied to clipboard.");
    } catch (e) {
      alert("Copy failed—select the code manually.");
    }
    document.body.removeChild(ta);
  }

  function utf8ToBase64(text) {
    return btoa(unescape(encodeURIComponent(String(text))));
  }

  function runCopyBodyB64() {
    var body = (document.getElementById("f-body") || {}).value || "";
    if (!body.trim()) {
      alert("Add article HTML first.");
      return;
    }
    var b64 = utf8ToBase64(body);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(b64).then(
        function () {
          var btn = document.getElementById("btn-body-b64");
          if (btn) {
            var t = btn.textContent;
            btn.textContent = "Copied!";
            setTimeout(function () {
              btn.textContent = t;
            }, 2000);
          }
        },
        function () {
          fallbackCopy(b64);
        }
      );
    } else {
      fallbackCopy(b64);
    }
  }

  function runDownload() {
    var pre = document.getElementById("admin-output");
    if (!pre || !pre.textContent) {
      alert("Generate code first.");
      return;
    }
    var slug = (document.getElementById("f-slug") || {}).value || "new-post";
    var blob = new Blob([pre.textContent], {
      type: "text/plain;charset=utf-8",
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "post-" + slugify(slug) + ".txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function onTitleInput() {
    var title = (document.getElementById("f-title") || {}).value || "";
    var slugEl = document.getElementById("f-slug");
    if (!slugEl || slugEl.dataset.touched === "1") return;
    slugEl.value = slugify(title);
  }

  function onSlugInput() {
    var slugEl = document.getElementById("f-slug");
    if (slugEl) slugEl.dataset.touched = "1";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var dateEl = document.getElementById("f-date");
    if (dateEl && !dateEl.value) {
      dateEl.value = todayISO();
    }

    var titleEl = document.getElementById("f-title");
    if (titleEl) {
      titleEl.addEventListener("input", onTitleInput);
    }
    var slugEl = document.getElementById("f-slug");
    if (slugEl) {
      slugEl.addEventListener("input", onSlugInput);
    }

    var gen = document.getElementById("btn-generate");
    if (gen) gen.addEventListener("click", runGenerate);
    var copy = document.getElementById("btn-copy");
    if (copy) copy.addEventListener("click", runCopy);
    var dl = document.getElementById("btn-download");
    if (dl) dl.addEventListener("click", runDownload);
    var b64 = document.getElementById("btn-body-b64");
    if (b64) b64.addEventListener("click", runCopyBodyB64);
  });
})();
