import { existsSync } from "node:fs";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllPosts } from "./markdown";
import { generateIndexPage, generatePostPage } from "./templates";
import type { Section } from "./types";

const OUTPUT_DIR = join(process.cwd(), "dist");

async function build() {
  console.log("Building static site...");

  await mkdir(OUTPUT_DIR, { recursive: true });

  // Copy static assets
  const picPath = join(process.cwd(), "pic.jpeg");
  if (existsSync(picPath)) {
    await copyFile(picPath, join(OUTPUT_DIR, "pic.jpeg"));
    console.log("Copied pic.jpeg");
  }

  const postsBySection = await getAllPosts();

  let totalPosts = 0;
  for (const section of Object.keys(postsBySection) as Section[]) {
    const posts = postsBySection[section];
    totalPosts += posts.length;
    console.log(`Found ${posts.length} ${section}`);
  }

  const indexHtml = generateIndexPage(postsBySection);
  await writeFile(join(OUTPUT_DIR, "index.html"), indexHtml);
  console.log("Generated index.html");

  for (const section of Object.keys(postsBySection) as Section[]) {
    const posts = postsBySection[section];

    for (const post of posts) {
      const postDir = join(OUTPUT_DIR, section, post.slug);
      await mkdir(postDir, { recursive: true });

      const postHtml = generatePostPage(post);
      await writeFile(join(postDir, "index.html"), postHtml);
      console.log(`Generated ${section}/${post.slug}/index.html`);
    }
  }

  console.log(`Build complete! Generated ${totalPosts} posts.`);
}

build().catch(console.error);
