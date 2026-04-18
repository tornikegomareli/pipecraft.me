import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import hljs from "highlight.js";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { SECTIONS } from "./config";
import type { Post, Section } from "./types";

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

function extractYouTubeId(text: string): string | undefined {
  const match = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1];
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

export async function getPostsFromSection(section: Section): Promise<Post[]> {
  const sectionPath = join(process.cwd(), SECTIONS[section].path);
  const posts: Post[] = [];

  try {
    const entries = await readdir(sectionPath);

    for (const entry of entries) {
      const entryPath = join(sectionPath, entry);
      const entryStat = await stat(entryPath);

      if (!entryStat.isDirectory() || entry.startsWith(".")) continue;

      const postPath = join(entryPath, "index.md");
      try {
        const raw = await readFile(postPath, "utf-8");
        const { data, content: markdownContent } = matter(raw);

        posts.push({
          slug: entry,
          title: data.title || "Untitled",
          date: data.date || new Date().toISOString(),
          spoiler: data.spoiler,
          content: await marked(markdownContent),
          section,
          readingTime: estimateReadingTime(markdownContent),
          youtubeId: extractYouTubeId(markdownContent),
        });
      } catch {
        // skip posts that can't be read
      }
    }
  } catch {
    // section directory doesn't exist yet
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllPosts(): Promise<Record<Section, Post[]>> {
  const allPosts: Record<Section, Post[]> = {
    posts: [],
    essays: [],
    projects: [],
    talks: [],
  };

  for (const section of Object.keys(SECTIONS) as Section[]) {
    allPosts[section] = await getPostsFromSection(section);
  }

  return allPosts;
}

export async function getPostBySlug(section: Section, slug: string): Promise<Post | null> {
  const posts = await getPostsFromSection(section);
  return posts.find((p) => p.slug === slug) ?? null;
}
