import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { serve } from "bun";

const DIST_DIR = join(process.cwd(), "dist");

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    if (pathname === "/") {
      pathname = "/index.html";
    } else if (!pathname.includes(".")) {
      pathname = join(pathname, "index.html");
    }

    const filePath = join(DIST_DIR, pathname);

    try {
      const file = await readFile(filePath);
      const ext = filePath.split(".").pop()?.toLowerCase();

      const contentTypes: Record<string, string> = {
        html: "text/html; charset=utf-8",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
      };

      const contentType = contentTypes[ext || ""] || "text/plain";

      return new Response(file, {
        headers: { "Content-Type": contentType },
      });
    } catch (err) {
      return new Response("404 Not Found", { status: 404 });
    }
  },
});

console.log("Server running at http://localhost:3000");
