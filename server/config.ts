import type { Section, SectionConfig } from "./types";

export const SECTIONS: Record<Section, SectionConfig> = {
  posts: { name: "posts", title: "Blog Posts", path: "posts" },
  essays: { name: "essays", title: "Essays", path: "essays" },
  projects: { name: "projects", title: "Projects", path: "projects" },
  talks: { name: "talks", title: "Talks", path: "talks" },
};

export const SITE_CONFIG = {
  name: "Tornike Gomareli",
  title: "Software Engineer",
  description: "Builder, Developer Evangelist, Technical Agnostic. Always learn how to think better.",
  links: {
    email: "tornike.gomareli@gmail.com",
    github: "tornikegomareli",
    linkedin: "tornikegomareli",
    twitter: "tornikegomareli",
  },
};
