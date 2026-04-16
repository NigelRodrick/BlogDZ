(function () {
  "use strict";

  function cfg() {
    return window.BLOG_CONFIG || {};
  }

  function posts() {
    return window.BLOG_POSTS || [];
  }

  function formatDateLong(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateShort(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /** “5 days ago” or short date — Revive-style meta */
  function formatRelativeOrShort(iso) {
    var pub = new Date(iso + "T12:00:00");
    var now = new Date();
    var diff = Math.floor((now - pub) / 86400000);
    if (diff < 0) return formatDateShort(iso);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return diff + " days ago";
    return formatDateShort(iso);
  }

  function estimateReadMinutes(post) {
    if (post.readMinutes != null && post.readMinutes > 0) {
      return post.readMinutes;
    }
    var text = (post.body || "").replace(/<[^>]+>/g, " ");
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
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

  function getFeedName() {
    var q = new URLSearchParams(window.location.search || "");
    var f = (q.get("feed") || "newest").toLowerCase();
    return f === "popular" ? "popular" : "newest";
  }

  function getPageNum() {
    var q = new URLSearchParams(window.location.search || "");
    var p = parseInt(q.get("page"), 10);
    return p > 0 ? p : 1;
  }

  function getFeedPosts() {
    return getFeedName() === "popular"
      ? popularOrder()
      : sortByNewest(posts());
  }

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
    document.querySelectorAll("[data-hero-intro]").forEach(function (el) {
      el.textContent = c.heroIntro || "";
    });
    document.querySelectorAll("[data-blog-title-1]").forEach(function (el) {
      el.textContent = c.blogTitleLine1 || "BLOG";
    });
    document.querySelectorAll("[data-blog-title-2]").forEach(function (el) {
      var line2 = c.blogTitleLine2;
      if (line2 && String(line2).trim()) {
        el.textContent = line2.trim();
        el.hidden = false;
      } else {
        el.textContent = "";
        el.hidden = true;
      }
    });

    var heroCta = document.getElementById("hero-cta");
    if (heroCta) {
      heroCta.textContent = c.heroCtaLabel || "Contact";
      heroCta.href = c.heroCtaHref || "contact.html";
    }

    var topCta = document.getElementById("top-bar-cta");
    if (topCta) {
      topCta.textContent = c.topCtaLabel || "Contact";
      topCta.href = c.topCtaHref || "contact.html";
    }

    var phoneWrap = document.getElementById("top-bar-phone-wrap");
    var topBar = document.getElementById("top-bar");
    if (phoneWrap) {
      phoneWrap.innerHTML = "";
      var phone = c.topPhone && String(c.topPhone).trim();
      var tel = c.topPhoneTel && String(c.topPhoneTel).trim();
      if (phone) {
        var pa = document.createElement("a");
        pa.className = "top-bar-phone__link";
        pa.href = tel ? "tel:" + tel.replace(/\s/g, "") : "#";
        pa.textContent = phone;
        phoneWrap.appendChild(pa);
      }
    }

    var contactPhoneWrap = document.getElementById("contact-phone-wrap");
    if (contactPhoneWrap) {
      contactPhoneWrap.replaceChildren();
      var phoneDisplay = c.topPhone && String(c.topPhone).trim();
      var phoneTel = c.topPhoneTel && String(c.topPhoneTel).trim();
      if (phoneDisplay && phoneTel) {
        var ca = document.createElement("a");
        ca.href = "tel:" + phoneTel.replace(/\s/g, "");
        ca.textContent = phoneDisplay;
        contactPhoneWrap.appendChild(ca);
      } else if (phoneDisplay) {
        contactPhoneWrap.textContent = phoneDisplay;
      }
    }
    if (topBar) {
      var showTop =
        (c.topPhone && c.topPhone.trim()) ||
        (c.topCtaLabel && c.topCtaLabel.trim());
      topBar.hidden = !showTop;
    }

    var fcta = document.getElementById("footer-cta-strip");
    var fct = document.querySelector("[data-footer-cta]");
    if (fcta && fct) {
      var line = c.footerCtaLine && String(c.footerCtaLine).trim();
      if (line) {
        fct.textContent = line;
        fcta.hidden = false;
      } else {
        fcta.hidden = true;
      }
    }

    if (document.body && document.body.dataset.page === "home") {
      document.title =
        siteDisplayName() + " — " + (c.homeDocumentTitle || "Blog");
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

  function highlightFeedSwitcher() {
    var feed = getFeedName();
    document.querySelectorAll("#feed-switcher a[data-feed]").forEach(function (a) {
      var active = a.getAttribute("data-feed") === feed;
      if (active) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
      a.classList.toggle("is-active", active);
    });
  }

  function createPostCard(post) {
    var li = document.createElement("li");
    var art = document.createElement("article");
    art.className = "post-card";

    var media = document.createElement("a");
    media.className = "post-card__media";
    media.href = "post.html#" + encodeURIComponent(post.slug);
    var imgUrl = post.image && String(post.image).trim();
    if (imgUrl) {
      var img = document.createElement("img");
      img.src = imgUrl;
      img.alt = "";
      img.loading = "lazy";
      img.className = "post-card__img";
      media.appendChild(img);
    } else {
      var ph = document.createElement("div");
      ph.className = "post-card__placeholder";
      ph.setAttribute("aria-hidden", "true");
      media.appendChild(ph);
    }

    var body = document.createElement("div");
    body.className = "post-card__body";

    var h2 = document.createElement("h2");
    h2.className = "post-card__title";
    var titleA = document.createElement("a");
    titleA.href = "post.html#" + encodeURIComponent(post.slug);
    titleA.textContent = post.title || "";
    h2.appendChild(titleA);

    var ex = document.createElement("p");
    ex.className = "post-card__excerpt";
    var excerpt = (post.excerpt || "").trim();
    if (excerpt.length > 180) excerpt = excerpt.slice(0, 177).trim() + "…";
    ex.textContent = excerpt;

    var meta = document.createElement("div");
    meta.className = "post-card__meta";
    var author = document.createElement("span");
    author.className = "post-card__author";
    author.textContent = post.author || siteDisplayName();
    var dateEl = document.createElement("span");
    dateEl.className = "post-card__when";
    dateEl.textContent = formatRelativeOrShort(post.published);
    var read = document.createElement("span");
    read.className = "post-card__read";
    read.textContent = estimateReadMinutes(post) + " min read";

    meta.appendChild(author);
    meta.appendChild(document.createTextNode(" · "));
    meta.appendChild(dateEl);
    meta.appendChild(document.createTextNode(" · "));
    meta.appendChild(read);

    body.appendChild(h2);
    body.appendChild(ex);
    body.appendChild(meta);

    art.appendChild(media);
    art.appendChild(body);
    li.appendChild(art);
    return li;
  }

  function renderPagination(totalItems) {
    var nav = document.getElementById("blog-pagination");
    if (!nav) return;
    var per = Math.max(1, cfg().postsPerPage || 6);
    var pages = Math.max(1, Math.ceil(totalItems / per));
    var page = Math.min(getPageNum(), pages);
    nav.replaceChildren();
    if (pages <= 1) return;

    var feed = getFeedName();
    var ul = document.createElement("ul");
    ul.className = "pagination__list";

    function linkFor(pn) {
      var u = new URL(window.location.href);
      u.searchParams.set("feed", feed);
      u.searchParams.set("page", String(pn));
      return u.pathname + u.search + u.hash;
    }

    for (var i = 1; i <= pages; i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = linkFor(i);
      a.textContent = String(i);
      if (i === page) {
        a.setAttribute("aria-current", "page");
        a.className = "pagination__link is-current";
      } else {
        a.className = "pagination__link";
      }
      li.appendChild(a);
      ul.appendChild(li);
    }
    nav.appendChild(ul);
  }

  function renderHomeFeeds() {
    var feedEl = document.getElementById("blog-feed");
    if (!feedEl) return;

    highlightFeedSwitcher();

    var list = getFeedPosts();
    var per = Math.max(1, cfg().postsPerPage || 6);
    var pages = Math.max(1, Math.ceil(list.length / per));
    var page = Math.min(Math.max(1, getPageNum()), pages);
    var start = (page - 1) * per;
    var slice = list.slice(start, start + per);

    feedEl.replaceChildren();
    slice.forEach(function (post) {
      feedEl.appendChild(createPostCard(post));
    });
    renderPagination(list.length);
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
          "Open an article from the blog, or use a link like post.html#welcome.";
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

    if (post.image && String(post.image).trim()) {
      var fig = document.createElement("div");
      fig.className = "article-hero-image";
      var im = document.createElement("img");
      im.src = post.image.trim();
      im.alt = "";
      fig.appendChild(im);
      root.appendChild(fig);
    }

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

    var meta = document.createElement("p");
    meta.className = "article-meta-row";
    meta.textContent =
      (post.author || siteDisplayName()) +
      " · " +
      formatDateLong(post.published) +
      " · " +
      estimateReadMinutes(post) +
      " min read";

    hdr.appendChild(h1);
    hdr.appendChild(meta);

    var body = document.createElement("article");
    body.className = "article-body";
    body.innerHTML = post.body || "";

    var back = document.createElement("p");
    var backA = document.createElement("a");
    backA.className = "back-link";
    backA.href = "index.html";
    backA.textContent = "← Back to blog";
    back.appendChild(backA);

    root.appendChild(hdr);
    root.appendChild(body);
    root.appendChild(back);

    document.title = (post.title || "Post") + " — " + siteDisplayName();
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
