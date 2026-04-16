/**
 * =============================================================================
 *  ADMIN: edit this file to run the blog
 * =============================================================================
 *
 *  1) Site labels — change BLOG_CONFIG (brand, footer, “Popular” order).
 *  2) Posts — add one object to BLOG_POSTS (copy the last entry as a template).
 *
 *  Each post needs:
 *    slug      — short id for the URL (letters, numbers, hyphens only).
 *               Page link becomes: post.html#your-slug
 *    title     — headline
 *    published — date as YYYY-MM-DD
 *    author    — byline name
 *    kicker    — small category line above the title
 *    excerpt   — short plain text for the home page (no HTML)
 *    body      — full article HTML inside backticks `...` (use <p>, <h2>, etc.)
 *
 *  Popular tab: list slugs in BLOG_CONFIG.popularSlugs in the order you want.
 *
 *  After saving, refresh the browser (index.html or post.html#slug).
 * =============================================================================
 */

window.BLOG_CONFIG = {
  siteBrand: "YOUR",
  siteTitleSuffix: "Blog",
  footerLine: "© 2026 Your Name",
  /** Slug order for the “Popular” tab (newest tab is always by date). */
  popularSlugs: ["on-static-sites", "welcome"],
};

window.BLOG_POSTS = [
  {
    slug: "welcome",
    title: "Welcome to the blog",
    published: "2026-04-17",
    author: "Site Staff",
    kicker: "From the desk",
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
          <li>Change <code>slug</code>, dates, kicker, excerpt, and
            <code>body</code> HTML.</li>
          <li>Optional: add the slug to <code>popularSlugs</code> in
            <code>BLOG_CONFIG</code> if it should appear on the Popular tab.</li>
        </ol>

        <blockquote>
          No build step and no database—just edit and refresh. When you outgrow
          this, you can move the same fields into a static site generator without
          changing the public layout much.
        </blockquote>

        <p>
          Update <code>BLOG_CONFIG</code> for your masthead brand and footer line.
        </p>
      `,
  },
  {
    slug: "on-static-sites",
    title: "Why static HTML still wins",
    published: "2026-04-17",
    author: "Site Staff",
    kicker: "Notes",
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
