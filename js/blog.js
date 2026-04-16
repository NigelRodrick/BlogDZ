(function () {
  "use strict";

  function cfg() {
    return window.BLOG_CONFIG || {};
  }

  function posts() {
    return window.BLOG_POSTS || [];
  }

  /** Long date, e.g. April 17, 2026 — list + article pages */
  function formatDateLong(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function siteDisplayName() {
    var c = cfg();
    if (c.siteName && String(c.siteName).trim()) return c.siteName.trim();
    return (
      ((c.siteBrand || "") + " " + (c.siteTitleSuffix || "")).trim() || "Site"
    );
  }

  function sortByNewest(list) {
    return list.slice().sort(function (a, b) {
      if (a.published === b.published) return 0;
      return a.published < b.published ? 1 : -1;
    });
  }

  function bySlug(slug) {
    var found = null;
    posts().forEach(function (p) {
      if (p.slug === slug) found = p;
    });
    return found;
  }

  function popularOrder() {
    var order = cfg().popularSlugs || [];
    var map = {};
    posts().forEach(function (p) {
      map[p.slug] = p;
    });
    var out = [];
    order.forEach(function (slug) {
      if (map[slug]) out.push(map[slug]);
    });
    if (out.length) return out;
    return sortByNewest(posts());
  }

  /** Which nav href is “current” (flat URLs from site root). */
  function navCurrentHref() {
    var p = document.body && document.body.dataset.page;
    var map = {
      home: "index.html",
      about: "about.html",
      "writing-clips": "writing-clips.html",
      photography: "photography.html",
      contact: "contact.html",
    };
    return map[p] || null;
  }

  function renderNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;
    var links = cfg().navLinks;
    if (!links || !links.length) return;
    var current = navCurrentHref();
    nav.replaceChildren();
    links.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      if (current && item.href === current) {
        a.setAttribute("aria-current", "page");
      }
      li.appendChild(a);
      nav.appendChild(li);
    });
  }

  function applyBranding() {
    var c = cfg();
    document.querySelectorAll("[data-site-name]").forEach(function (el) {
      el.textContent = siteDisplayName();
    });
    document.querySelectorAll("[data-site-tagline]").forEach(function (el) {
      el.textContent = c.tagline || "";
    });
    document.querySelectorAll("[data-footer-line]").forEach(function (el) {
      el.textContent = c.footerLine || "";
    });
    document.querySelectorAll("[data-developer-credit]").forEach(function (el) {
      el.textContent = c.developerCredit || "";
    });
    if (document.body && document.body.dataset.page === "home") {
      document.title =
        siteDisplayName() + " — " + (c.homeDocumentTitle || "Log");
    }
    var p = document.body && document.body.dataset.page;
    var staticTitles = {
      about: "About",
      "writing-clips": "Writing Clips",
      photography: "Photography",
      contact: "Contact",
    };
    if (p && staticTitles[p]) {
      document.title = staticTitles[p] + " — " + siteDisplayName();
    }
  }

  function createPostRow(post) {
    var li = document.createElement("li");
    var art = document.createElement("article");
    art.className = "post-item";

    var h2 = document.createElement("h2");
    h2.className = "post-title";
    var titleA = document.createElement("a");
    titleA.href = "post.html#" + encodeURIComponent(post.slug);
    titleA.textContent = post.title || "";
    h2.appendChild(titleA);

    var dateP = document.createElement("p");
    dateP.className = "post-date";
    dateP.textContent = formatDateLong(post.published);

    var ex = document.createElement("p");
    ex.className = "post-excerpt";
    ex.appendChild(document.createTextNode((post.excerpt || "").trim() + " "));
    var rm = document.createElement("a");
    rm.className = "read-more";
    rm.href = "post.html#" + encodeURIComponent(post.slug);
    rm.textContent = "Read more";
    ex.appendChild(rm);

    art.appendChild(h2);
    art.appendChild(dateP);
    art.appendChild(ex);
    li.appendChild(art);
    return li;
  }

  function renderHomeFeeds() {
    var newestEl = document.getElementById("feed-newest");
    var popularEl = document.getElementById("feed-popular");
    if (!newestEl || !popularEl) return;

    newestEl.replaceChildren();
    popularEl.replaceChildren();

    sortByNewest(posts()).forEach(function (post) {
      newestEl.appendChild(createPostRow(post));
    });
    popularOrder().forEach(function (post) {
      popularEl.appendChild(createPostRow(post));
    });
  }

  function renderArticlePage() {
    var root = document.getElementById("article-root");
    if (!root) return;

    var slug = decodeURIComponent(
      (location.hash || "").replace(/^#/, "").trim()
    );
    var post = slug ? bySlug(slug) : null;

    if (!post) {
      root.innerHTML = "";
      var miss = document.createElement("div");
      miss.className = "article-body";
      var p = document.createElement("p");
      if (!slug) {
        p.textContent =
          "Open an article from the log, or use a link like post.html#welcome.";
      } else {
        p.textContent =
          'No post with slug "' + slug + '". Check content.js and the URL.';
      }
      miss.appendChild(p);
      root.appendChild(miss);
      document.title =
        siteDisplayName() + " — " + (slug ? "Not found" : "Article");
      return;
    }

    root.innerHTML = "";

    var hdr = document.createElement("header");
    hdr.className = "article-header";

    if (post.kicker && String(post.kicker).trim()) {
      var kickP = document.createElement("p");
      kickP.className = "post-kicker";
      kickP.textContent = post.kicker.trim();
      hdr.appendChild(kickP);
    }

    var h1 = document.createElement("h1");
    h1.textContent = post.title || "";

    var dateP = document.createElement("p");
    dateP.className = "post-date";
    dateP.textContent = formatDateLong(post.published);

    hdr.appendChild(h1);
    hdr.appendChild(dateP);

    if (post.author && String(post.author).trim()) {
      var by = document.createElement("p");
      by.className = "post-byline";
      by.appendChild(document.createTextNode("By " + post.author.trim()));
      hdr.appendChild(by);
    }

    var body = document.createElement("article");
    body.className = "article-body";
    body.innerHTML = post.body || "";

    var back = document.createElement("p");
    var backA = document.createElement("a");
    backA.className = "back-link";
    backA.href = "index.html";
    backA.textContent = "← Back to log";
    back.appendChild(backA);

    root.appendChild(hdr);
    root.appendChild(body);
    root.appendChild(back);

    document.title =
      (post.title || "Post") + " — " + siteDisplayName();
  }

  function run() {
    applyBranding();
    renderNav();
    if (document.body.dataset.page === "home") {
      renderHomeFeeds();
    }
    if (document.body.dataset.page === "post") {
      renderArticlePage();
      window.addEventListener("hashchange", renderArticlePage);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
