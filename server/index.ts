import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { getTopRepositories } from "./github";
import { getAllPosts, getPostBySlug } from "./markdown";
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
      return new Response(indexHtml, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  });

app.listen(Number(process.env.PORT) || 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
