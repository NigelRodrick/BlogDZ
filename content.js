/**
 * =============================================================================
 *  ADMIN: edit this file
 * =============================================================================
 *  Theme colors live in css/style.css (:root) — Revive-style greens #97C693 / #F4FFF7.
 *  Core focus: highlight issues that happen in life (stress, change, work, etc.).
 *  Layout: top bar, hero + CTA, split title, card grid + meta + pagination.
 *
 *  BLOG_CONFIG — site chrome, contactEmail, hero, footer CTA, pagination size.
 *  BLOG_POSTS — each post: slug, title, published, author, excerpt, body,
 *    optional image (URL or path), readMinutes (optional; else estimated).
 *  popularSlugs — order for the “Popular” feed.
 *
 *  Publish: GitHub → Actions → “Publish blog post” → Run workflow (inserts into this
 *  file on main; Pages redeploys). Or draft in admin.html and paste into BLOG_POSTS.
 */
window.BLOG_CONFIG = {
  siteName: "Dellar Zvinavashe",
  tagline: "Highlighting the issues that show up in real life",
  homeDocumentTitle: "Blog",
  footerLine: "© 2026 Dellar Zvinavashe",
  developerCredit: "Developed by Fidinsky Tech Solutions",

  /** Top bar — display text and tel: href (digits / + only in Tel) */
  topPhone: "+263 774 073 707",
  topPhoneTel: "+263774073707",
  topCtaLabel: "Contact",
  topCtaHref: "contact.html",

  /** Shown on the Contact page */
  contactEmail: "zvinavashe.d@gmail.com",

  /** Hero — core idea: life issues, honestly */
  heroIntro:
    "Welcome. This blog puts a spotlight on the issues that come up in everyday life—stress, change, relationships, work, money, health, and the messy in-between. Honest notes on what happens when life doesn’t stay on script.",
  heroCtaLabel: "Get in touch",
  heroCtaHref: "contact.html",

  /** Large split headline (line 1 dark, line 2 brand green) */
  blogTitleLine1: "LIFE",
  blogTitleLine2: "ISSUES",

  /** Strip above footer; empty string hides it */
  footerCtaLine:
    "Real life isn’t a highlight reel—if something here speaks to you, you’re not alone.",

  postsPerPage: 6,

  navLinks: [
    { label: "Writing Clips", href: "writing-clips.html" },
    { label: "Photography", href: "photography.html" },
    { label: "Blog", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Contact", href: "contact.html" },
  ],
  popularSlugs: ["on-static-sites", "welcome"],
};

window.BLOG_POSTS = [
  {
    slug: "welcome",
    title: "What this blog is about",
    published: "2026-04-17",
    author: "Dellar Zvinavashe",
    kicker: "Introduction",
    image: "",
    readMinutes: 4,
    excerpt:
      "The heart of this site is simple: to highlight issues that happen in life—the pressures, transitions, and questions we don’t always say out loud. Here’s what you can expect.",
    body: `
        <p>
          Most of us move through life juggling expectations, setbacks, and surprises.
          This blog exists to name some of that noise: not as advice from on high,
          but as clear writing about <strong>issues that show up in real life</strong>—work,
          family, money, health, identity, loss, starting over, and everything that
          doesn’t fit neatly in a caption.
        </p>

        <h2>What you’ll find here</h2>
        <ul>
          <li>Honest takes on everyday struggles and bigger turning points</li>
          <li>Reflections that connect personal story to what many people face</li>
          <li>No pretend perfection—just the work of thinking in public</li>
        </ul>

        <blockquote>
          If something you read here feels familiar, that’s the point. We’re not
          polishing life for the feed; we’re looking at what actually happens.
        </blockquote>

        <p>
          <em>Technical note for editors:</em> posts live in <code>content.js</code>;
          add new entries to <code>BLOG_POSTS</code> and refresh the site.
        </p>
      `,
  },
  {
    slug: "on-static-sites",
    title: "When stress stops being “just a phase”",
    published: "2026-04-17",
    author: "Dellar Zvinavashe",
    kicker: "Life & pressure",
    image: "",
    readMinutes: 3,
    excerpt:
      "Sometimes stress isn’t dramatic—it’s chronic. A sample piece on how low-grade pressure can shape a season of life, and why naming it matters.",
    body: `
        <p>
          There’s the kind of stress that has a clear start and end: exams, a move,
          a crisis. Then there’s the kind that lingers—tight chest on Sunday night,
          short fuse with people you love, scrolling instead of sleeping. It can
          feel too ordinary to complain about, which is exactly why it’s easy to ignore.
        </p>

        <p>
          This post is a placeholder you can replace with your own story or angle.
          The core idea: <strong>life issues</strong> don’t always arrive with a label.
          Part of this blog is giving those experiences a little room to breathe.
        </p>

        <p>
          When you’re ready, swap this article for a real piece in
          <code>content.js</code>—same slug or a new one—and keep writing.
        </p>
      `,
  },
];
