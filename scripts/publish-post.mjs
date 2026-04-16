/**
 * Inserts a new entry at the top of window.BLOG_POSTS in content.js.
 * Run from GitHub Actions (workflow_dispatch) with POST_* env vars.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT_PATH = path.join(ROOT, "content.js");

function escapeStr(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatPostBlock(p) {
  const bodyEscaped = String(p.body).replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  const lines = [];
  lines.push("  {");
  lines.push(`    slug: "${escapeStr(p.slug)}",`);
  lines.push(`    title: ${JSON.stringify(p.title)},`);
  lines.push(`    published: "${escapeStr(p.published)}",`);
  lines.push(`    author: ${JSON.stringify(p.author)},`);
  lines.push(`    kicker: ${JSON.stringify(p.kicker)},`);
  lines.push(`    image: ${JSON.stringify(p.image)},`);
  if (p.readMinutes != null) {
    lines.push(`    readMinutes: ${p.readMinutes},`);
  }
  lines.push("    excerpt:");
  lines.push(`      ${JSON.stringify(p.excerpt)},`);
  lines.push("    body: `");
  lines.push(bodyEscaped);
  lines.push("    `,");
  lines.push("  },");
  return lines.join("\n");
}

function slugExists(content, slug) {
  const safe = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`slug:\\s*"${safe}"`).test(content);
}

function insertPost(content, block) {
  const marker = "window.BLOG_POSTS = [";
  const i = content.indexOf(marker);
  if (i === -1) {
    throw new Error('Could not find "window.BLOG_POSTS = [" in content.js');
  }
  const insertAt = i + marker.length;
  return content.slice(0, insertAt) + "\n" + block + content.slice(insertAt);
}

function addPopularSlug(content, slug) {
  const innerMatch = content.match(/popularSlugs:\s*\[([^\]]*)\]/);
  if (!innerMatch) return content;
  const inner = innerMatch[1];
  const quoted = new RegExp(`["']${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  if (quoted.test(inner)) return content;
  return content.replace(/(popularSlugs:\s*\[)/, `$1"${slug}", `);
}

function parseReadMinutes(raw) {
  if (raw == null || String(raw).trim() === "") return null;
  const n = parseInt(String(raw).trim(), 10);
  if (Number.isNaN(n) || n < 1) return null;
  return n;
}

function getBody() {
  const b64 = (process.env.POST_BODY_B64 || "").replace(/\s/g, "");
  if (b64) {
    return Buffer.from(b64, "base64").toString("utf8");
  }
  return process.env.POST_BODY ?? "";
}

function main() {
  const title = (process.env.POST_TITLE || "").trim();
  const slug = (process.env.POST_SLUG || "").trim();
  const published = (process.env.POST_PUBLISHED || "").trim();
  const author = (process.env.POST_AUTHOR || "").trim() || "Dellar Zvinavashe";
  const kicker = (process.env.POST_KICKER || "").trim();
  const image = (process.env.POST_IMAGE || "").trim();
  const excerpt = (process.env.POST_EXCERPT || "").trim();
  const body = getBody();
  const readMinutes = parseReadMinutes(process.env.POST_READ_MINUTES);
  const addPopular =
    String(process.env.POST_ADD_POPULAR || "").toLowerCase() === "true";

  if (!title) {
    console.error("POST_TITLE is required.");
    process.exit(1);
  }
  if (!slug) {
    console.error("POST_SLUG is required.");
    process.exit(1);
  }
  if (!published || !/^\d{4}-\d{2}-\d{2}$/.test(published)) {
    console.error("POST_PUBLISHED must be YYYY-MM-DD.");
    process.exit(1);
  }
  if (!excerpt) {
    console.error("POST_EXCERPT is required.");
    process.exit(1);
  }
  if (!body.trim()) {
    console.error("POST_BODY is required (or POST_BODY_B64).");
    process.exit(1);
  }

  let content = fs.readFileSync(CONTENT_PATH, "utf8");

  if (slugExists(content, slug)) {
    console.error(`Slug already exists: "${slug}"`);
    process.exit(1);
  }

  const post = {
    slug,
    title,
    published,
    author,
    kicker,
    image,
    excerpt,
    body,
    readMinutes,
  };

  const block = formatPostBlock(post);
  content = insertPost(content, block);

  if (addPopular) {
    content = addPopularSlug(content, slug);
  }

  fs.writeFileSync(CONTENT_PATH, content, "utf8");
  console.log(`Inserted post slug="${slug}" into content.js`);
}

main();
