import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
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

export async function getPostsFromSection(section: Section): Promise<Post[]> {
  const sectionPath = join(process.cwd(), SECTIONS[section].path);
  const posts: Post[] = [];

  try {
    const entries = await readdir(sectionPath);

    for (const entry of entries) {
      const entryPath = join(sectionPath, entry);
      const entryStat = await stat(entryPath);

      if (!entryStat.isDirectory() || entry.startsWith(".")) {
        continue;
      }

      const postPath = join(entryPath, "index.md");
      try {
        const content = await readFile(postPath, "utf-8");
        const { data, content: markdownContent } = matter(content);

        posts.push({
          slug: entry,
          title: data.title || "Untitled",
          date: data.date || new Date().toISOString(),
          spoiler: data.spoiler,
          content: await marked(markdownContent),
          section,
        });
      } catch (err) {
        console.error(`Error reading ${section}/${entry}:`, err);
      }
    }
  } catch (err) {
    console.error(`Error reading section ${section}:`, err);
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllPosts(): Promise<Record<Section, Post[]>> {
  const allPosts: Record<Section, Post[]> = {
    posts: [],
    projects: [],
    talks: [],
  };

  for (const section of Object.keys(SECTIONS) as Section[]) {
    allPosts[section] = await getPostsFromSection(section);
  }

  return allPosts;
}
