export interface PostMetadata {
  title: string;
  date: string;
  spoiler?: string;
}

export interface Post extends PostMetadata {
  slug: string;
  content: string;
  section: Section;
}

export type Section = "posts" | "projects" | "talks" | "essays";

export interface SectionConfig {
  name: string;
  title: string;
  path: string;
}
