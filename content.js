/**
 * =============================================================================
 *  ADMIN: edit this file to run the blog
 * =============================================================================
 *
 *  Site: set BLOG_CONFIG (name, tagline, nav links, footer, developerCredit).
 *  Nav order mirrors jeremydlarson.com: Writing Clips, Photography, Log, About, Contact.
 *  Posts: add objects to BLOG_POSTS (copy the last entry as a template).
 *
 *  Each post:
 *    slug, title, published (YYYY-MM-DD), author, excerpt, body (HTML in `...`)
 *    kicker — optional small label above the title on the article page only
 *
 *  Home page layout follows the style of personal sites like
 *  http://www.jeremydlarson.com/ (title → date → excerpt → Read more).
 *
 *  popularSlugs — order for the “Popular” archive tab; omit to mirror newest.
 */
window.BLOG_CONFIG = {
  siteName: "Dellar Zvinavashe",
  tagline: "Writer / editor / DJ",
  homeDocumentTitle: "Log",
  footerLine: "© 2026 Dellar Zvinavashe",
  /** Shown under the copyright line site-wide. */
  developerCredit: "Developed by Fidinsky Tech Solutions",
  navLinks: [
    { label: "Writing Clips", href: "writing-clips.html" },
    { label: "Photography", href: "photography.html" },
    { label: "Log", href: "index.html" },
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
          <li>Change <code>slug</code>, dates, excerpt, and
            <code>body</code> HTML.</li>
          <li>Optional: add the slug to <code>popularSlugs</code> for the
            Popular tab.</li>
        </ol>

        <blockquote>
          No build step and no database—just edit and refresh. The home
          page is inspired by the clean layout of sites like
          <a href="http://www.jeremydlarson.com/">jeremydlarson.com</a>.
        </blockquote>

        <p>
          Update <code>BLOG_CONFIG</code> for your name, tagline, and navigation.
        </p>
      `,
  },
  {
    slug: "on-static-sites",
    title: "Why static HTML still wins",
    published: "2026-04-17",
    author: "Dellar Zvinavashe",
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
