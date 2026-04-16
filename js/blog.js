(function () {
  "use strict";

  function cfg() {
    return window.BLOG_CONFIG || {};
  }

  function posts() {
    return window.BLOG_POSTS || [];
  }

  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  function applyBranding() {
    var c = cfg();
    document.querySelectorAll("[data-site-brand]").forEach(function (el) {
      el.textContent = c.siteBrand || "YOUR";
    });
    document.querySelectorAll("[data-site-suffix]").forEach(function (el) {
      el.textContent = " " + (c.siteTitleSuffix || "Blog");
    });
    document.querySelectorAll("[data-footer-line]").forEach(function (el) {
      el.textContent = c.footerLine || "";
    });
    if (document.body && document.body.dataset.page === "home") {
      document.title =
        (c.siteBrand || "Blog").trim() +
        " " +
        (c.siteTitleSuffix || "").trim() +
        " — Home";
    }
  }

  function createPostRow(post, filterHash) {
    var hash = filterHash || "#newest";
    var li = document.createElement("li");
    var art = document.createElement("article");
    art.className = "post-item";

    var kickerP = document.createElement("p");
    kickerP.className = "post-kicker";
    var kickerA = document.createElement("a");
    kickerA.href = "index.html" + hash;
    kickerA.textContent = post.kicker || "";
    kickerP.appendChild(kickerA);

    var h2 = document.createElement("h2");
    h2.className = "post-title";
    var titleA = document.createElement("a");
    titleA.href = "post.html#" + encodeURIComponent(post.slug);
    titleA.textContent = post.title || "";
    h2.appendChild(titleA);

    var by = document.createElement("p");
    by.className = "post-byline";
    var l1 = document.createElement("span");
    l1.className = "label";
    l1.textContent = "By";
    by.appendChild(l1);
    by.appendChild(document.createTextNode(" " + (post.author || "") + " "));
    var l2 = document.createElement("span");
    l2.className = "label";
    l2.textContent = "on";
    by.appendChild(l2);
    by.appendChild(document.createTextNode(" " + formatDate(post.published)));

    var ex = document.createElement("p");
    ex.className = "post-excerpt";
    ex.appendChild(document.createTextNode((post.excerpt || "").trim() + " "));
    var rm = document.createElement("a");
    rm.className = "read-more";
    rm.href = "post.html#" + encodeURIComponent(post.slug);
    rm.textContent = "Read more";
    ex.appendChild(rm);

    art.appendChild(kickerP);
    art.appendChild(h2);
    art.appendChild(by);
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
      newestEl.appendChild(createPostRow(post, "#newest"));
    });
    popularOrder().forEach(function (post) {
      popularEl.appendChild(createPostRow(post, "#popular"));
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
          "Open an article from the home page, or use a link like post.html#welcome.";
      } else {
        p.textContent =
          'No post with slug "' + slug + '". Check content.js and the URL.';
      }
      miss.appendChild(p);
      root.appendChild(miss);
      document.title =
        (cfg().siteBrand || "Blog") +
        " — " +
        (slug ? "Not found" : "Article");
      return;
    }

    root.innerHTML = "";

    var hdr = document.createElement("header");
    hdr.className = "article-header";

    var kickP = document.createElement("p");
    kickP.className = "post-kicker";
    var kickA = document.createElement("a");
    kickA.href = "index.html#newest";
    kickA.textContent = post.kicker || "";
    kickP.appendChild(kickA);

    var h1 = document.createElement("h1");
    h1.textContent = post.title || "";

    var by = document.createElement("p");
    by.className = "post-byline";
    var s1 = document.createElement("span");
    s1.className = "label";
    s1.textContent = "By";
    by.appendChild(s1);
    by.appendChild(document.createTextNode(" " + (post.author || "") + " "));
    var s2 = document.createElement("span");
    s2.className = "label";
    s2.textContent = "on";
    by.appendChild(s2);
    by.appendChild(document.createTextNode(" " + formatDate(post.published)));

    hdr.appendChild(kickP);
    hdr.appendChild(h1);
    hdr.appendChild(by);

    var body = document.createElement("article");
    body.className = "article-body";
    body.innerHTML = post.body || "";

    var back = document.createElement("p");
    var backA = document.createElement("a");
    backA.className = "back-link";
    backA.href = "index.html";
    backA.textContent = "← All posts";
    back.appendChild(backA);

    root.appendChild(hdr);
    root.appendChild(body);
    root.appendChild(back);

    document.title =
      (post.title || "Post") +
      " — " +
      (cfg().siteBrand || "") +
      " " +
      (cfg().siteTitleSuffix || "").trim();
  }

  function run() {
    applyBranding();
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
