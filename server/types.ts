export interface PostMeta {
  title: string;
  date: string;
  spoiler?: string;
}

export interface Post extends PostMeta {
  slug: string;
  content: string;
  section: Section;
  readingTime: number;
  youtubeId?: string;
}

export type Section = "posts" | "projects" | "talks" | "essays";

export interface SectionConfig {
  name: string;
  title: string;
  path: string;
}
