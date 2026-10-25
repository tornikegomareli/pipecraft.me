import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { SITE_CONFIG } from "./config";
import { getContributions, getStarredRepositories, getTopRepositories } from "./github";
import { getAllPosts, getPostBySlug } from "./markdown";
import { renderCard } from "./og";
import type { Section } from "./types";

const distPath = join(process.cwd(), "dist");
const publicPath = join(process.cwd(), "public");
const hasDistBuild = existsSync(join(distPath, "index.html"));

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getMime(path: string): string {
  return MIME_TYPES[extname(path).toLowerCase()] || "application/octet-stream";
}

async function serveStatic(filePath: string): Promise<Response | null> {
  const file = Bun.file(filePath);
  if (await file.exists()) {
    return new Response(file, {
      headers: { "content-type": getMime(filePath) },
    });
  }
  return null;
}

// Posts change only on deploy, so link previews read them once
const posts = getAllPosts().then(
  (all) =>
    new Map(
      Object.values(all)
        .flat()
        .map((p) => [`/${p.section}/${p.slug}`, p]),
    ),
);
const cards = new Map<string, Promise<Buffer>>();

// The image a shared link shows: /og.png for the home page, /og/<section>/<slug>.png for a post
async function card(path: string): Promise<Response> {
  const post = (await posts).get(path);
  if (path && !post) return new Response("Not found", { status: 404 });
  let png = cards.get(path);
  if (!png) {
    png = post ? renderCard(post.title, SITE_CONFIG.name) : renderCard(SITE_CONFIG.name, SITE_CONFIG.description);
    cards.set(path, png);
  }
  return new Response(await png, { headers: { "content-type": "image/png" } });
}

// Link preview bots don't run JavaScript, so the page's preview tags go into the HTML
async function withPreview(html: string, path: string): Promise<string> {
  const post = (await posts).get(path);
  const esc = Bun.escapeHTML;
  const title = post?.title ?? SITE_CONFIG.name;
  const description = post?.spoiler ?? SITE_CONFIG.description;
  const tags = `<title>${esc(post ? `${post.title} — ${SITE_CONFIG.name}` : title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(SITE_CONFIG.url + path)}" />
    <meta property="og:image" content="${esc(`${SITE_CONFIG.url}/og${post ? path : ""}.png`)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />`;
  return html.replace(/<title>.*<\/title>/, () => tags);
}

const app = new Elysia()
  .use(cors())
  // API routes
  .get("/api/posts", async () => {
    const postsBySection = await getAllPosts();
    const listing: Record<string, unknown[]> = {};
    for (const [section, posts] of Object.entries(postsBySection)) {
      listing[section] = posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        spoiler: p.spoiler,
        section: p.section,
        readingTime: p.readingTime,
        youtubeId: p.youtubeId,
      }));
    }
    return listing;
  })
  .get("/api/posts/:section/:slug", async ({ params, set }) => {
    const { section, slug } = params;
    const post = await getPostBySlug(section as Section, slug);
    if (!post) {
      set.status = 404;
      return { error: "Post not found" };
    }
    return post;
  })
  .get("/api/repos", async () => {
    return await getTopRepositories();
  })
  .get("/api/projects", async () => {
    return await getStarredRepositories();
  })
  .get("/api/contributions", async () => {
    return await getContributions();
  })
  .get("/og.png", () => card(""))
  .get("/og/:section/:file", ({ params }) => card(`/${params.section}/${params.file.replace(/\.png$/, "")}`))
  .onRequest(async ({ request, set }) => {
    const url = new URL(request.url);
    const path = url.pathname;

    // Skip API routes
    if (path.startsWith("/api/")) return;

    // Try dist (built Vite assets)
    if (hasDistBuild) {
      const distFile = join(distPath, path);
      const file = Bun.file(distFile);
      if (await file.exists()) {
        return new Response(file, {
          headers: { "content-type": getMime(distFile) },
        });
      }
    }

    // Try public (images, favicon, etc.)
    const publicFile = join(publicPath, path);
    const file = Bun.file(publicFile);
    if (await file.exists()) {
      return new Response(file, {
        headers: { "content-type": getMime(publicFile) },
      });
    }

    // SPA fallback for client-side routes
    if (hasDistBuild && !extname(path)) {
      const indexHtml = await Bun.file(join(distPath, "index.html")).text();
      return new Response(await withPreview(indexHtml, path), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  });

app.listen(Number(process.env.PORT) || 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
