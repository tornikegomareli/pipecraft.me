import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { getTopRepositories } from "./github";
import { getAllPosts } from "./markdown";
import { generateHtmlLayout, generateIndexContent, generatePostContent } from "./server-templates";
import type { Section } from "./types";

const app = new Elysia()
  .use(
    staticPlugin({
      assets: "public",
      prefix: "/",
    }),
  )
  .get("/", async ({ request }) => {
    try {
      const [postsBySection, githubRepos] = await Promise.all([getAllPosts(), getTopRepositories()]);

      const content = generateIndexContent(postsBySection, githubRepos);

      // Check if this is an HTMX request - HTMX sends this header
      const isHtmxRequest = request.headers.get("HX-Request") === "true";

      if (isHtmxRequest) {
        return new Response(content, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return new Response(generateHtmlLayout("Tornike Gomareli", content), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("Error in home route:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  })
  .get("/:section/:slug", async ({ params, set, request }) => {
    const { section, slug } = params;
    const postsBySection = await getAllPosts();
    const posts = postsBySection[section as Section];

    if (!posts) {
      set.status = 404;
      return new Response("Not Found", { status: 404 });
    }

    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      set.status = 404;
      return new Response("Not Found", { status: 404 });
    }

    const content = generatePostContent(post);

    // Check if this is an HTMX request - HTMX sends this header with capital letters
    const isHtmxRequest = request.headers.get("HX-Request") === "true";

    if (isHtmxRequest) {
      // Return just the content for HTMX requests
      return new Response(content, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Return full page for direct navigation
    return new Response(generateHtmlLayout(post.title, content), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  })
  .get("/api/posts/:section", async ({ params }) => {
    const { section } = params;
    const postsBySection = await getAllPosts();
    const posts = postsBySection[section as Section] || [];

    // Return just the posts HTML for HTMX
    const html = posts
      .map((post) => {
        const dateStr = new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return `<div class="post-item">${dateStr} - <a href="/${section}/${post.slug}/" hx-get="/${section}/${post.slug}" hx-target="#content" hx-push-url="true">${post.title}</a></div>`;
      })
      .join("");

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
