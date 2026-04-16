/**
 * =============================================================================
 *  ADMIN: edit this file
 * =============================================================================
 *  Theme colors live in css/style.css (:root) — Revive-style greens #97C693 / #F4FFF7.
 *  Layout follows the blog structure used at
 *  https://www.revivetherapeuticservices.com/mentalhealthblog
 *  (top bar, hero + CTA, split title, cards with image + meta + pagination).
 *
 *  BLOG_CONFIG — site chrome, hero, footer CTA, pagination size.
 *  BLOG_POSTS — each post: slug, title, published, author, excerpt, body,
 *    optional image (URL or path), readMinutes (optional; else estimated).
 *  popularSlugs — order for the “Popular” feed.
 */
window.BLOG_CONFIG = {
  siteName: "Dellar Zvinavashe",
  tagline: "Writer / editor / DJ",
  homeDocumentTitle: "Mental Health Blog",
  footerLine: "© 2026 Dellar Zvinavashe",
  developerCredit: "Developed by Fidinsky Tech Solutions",

  /** Top bar (like Revive’s phone + action link) */
  topPhone: "",
  topPhoneTel: "",
  topCtaLabel: "Contact",
  topCtaHref: "contact.html",

  /** Hero welcome + primary button (Revive-style welcome strip) */
  heroIntro:
    "Welcome to the mental health blog! Here you can find self-care tips and ideas. We share insights on mental wellness and practical ways to support positive mental health—so readers have the resources they need to thrive.",
  heroCtaLabel: "Book appointment",
  heroCtaHref: "contact.html",

  /** Large split headline — same pattern as Revive (line 1 dark, line 2 brand green) */
  blogTitleLine1: "MENTAL",
  blogTitleLine2: "HEALTH BLOG",

  /** Strip above footer (Revive-style tagline); empty string hides it */
  footerCtaLine:
    "Empower your mental wellbeing—take the next step.",

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
    title: "Welcome to the blog",
    published: "2026-04-17",
    author: "Dellar Zvinavashe",
    kicker: "",
    image: "",
    readMinutes: 4,
    excerpt:
      "How this site is structured and how to add posts by editing one file. When you are ready to ship, point any static host at this folder and you are done.",
    body: `
        <p>
          This project is a small static site: one home page, shared styles in
          <code>css/style.css</code>, and a single admin file
          <code>content.js</code> that holds every article. Open
          <code>index.html</code> in your browser to preview; when you publish,
          any static host (GitHub Pages, Netlify, etc.) will work the same way.
        </p>

        <h2>Adding a post</h2>
        <ol>
          <li>Open <code>content.js</code>.</li>
          <li>Copy the last post object in <code>BLOG_POSTS</code>.</li>
          <li>Set <code>image</code> (optional URL), <code>readMinutes</code> or rely on auto estimate.</li>
        </ol>

        <blockquote>
          The blog index uses a card grid, hero, and pagination pattern similar to
          professional blog hubs—configure it all in <code>BLOG_CONFIG</code>.
        </blockquote>

        <p>
          Update <code>BLOG_CONFIG</code> for hero text, phone bar, and split title.
        </p>
      `,
  },
  {
    slug: "on-static-sites",
    title: "Why static HTML still wins",
    published: "2026-04-17",
    author: "Dellar Zvinavashe",
    kicker: "Notes",
    image: "",
    readMinutes: 3,
    excerpt:
      "Frameworks are useful when the product needs them. For a personal blog, the interesting part is the writing—not the deployment graph.",
    body: `
        <p>
          Frameworks are useful when the product needs them. For a personal blog,
          the interesting part is the writing—not the deployment graph. A folder
          of HTML and scripts loads fast, ages well, and never surprises you with
          a broken toolchain after six quiet months.
        </p>

        <h2>What you trade away</h2>
        <p>
          You do not get automatic tag pages or RSS out of the box. Those are
          solvable with a small amount of extra scripting or a generator when the
          archive grows.
        </p>

        <p>
          Treat this article as a placeholder: replace the copy in
          <code>content.js</code> when you publish something real.
        </p>
      `,
  },
];
