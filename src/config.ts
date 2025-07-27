import type { Section, SectionConfig } from "./types";

export const SECTIONS: Record<Section, SectionConfig> = {
  posts: {
    name: "posts",
    title: "Blog Posts",
    path: "posts",
  },
  projects: {
    name: "projects",
    title: "Projects",
    path: "projects",
  },
  talks: {
    name: "talks",
    title: "Talks",
    path: "talks",
  },
};
