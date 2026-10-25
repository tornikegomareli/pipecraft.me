export interface PostItem {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  section: string;
  readingTime: number;
  youtubeId?: string;
}

export interface Post extends PostItem {
  content: string;
}

export type PostsBySection = Record<string, PostItem[]>;

// Dates are stored as "YYYY-MM-DD", which parses as UTC midnight.
// Formatting in UTC keeps "2025-12-01" from showing as November west of Greenwich.
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function formatMonthYear(date: string): string {
  return monthYear.format(new Date(date));
}

export function formatFullDate(date: string): string {
  return fullDate.format(new Date(date));
}

export function writing(data: PostsBySection | null): PostItem[] {
  const all = [...(data?.essays ?? []), ...(data?.posts ?? [])];
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
