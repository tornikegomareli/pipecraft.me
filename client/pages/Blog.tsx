import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

interface PostItem {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  section: string;
  readingTime: number;
}

type PostsBySection = Record<string, PostItem[]>;

function fmtShort(s: string): string {
  const d = new Date(s);
  const m = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const y = String(d.getFullYear()).slice(2);
  return `${m} ${String(d.getDate()).padStart(2, "0")}, ${y}`;
}

export default function Blog() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  if (loading) return <div className="loading-state">loading...</div>;
  const posts = data?.posts || [];

  return (
    <>
      <div className="intro">
        <h1>Blog</h1>
        <p>Technical write-ups on Swift, concurrency, and the tools I build along the way.</p>
      </div>
      <div className="entries">
        {posts.map((e) => (
          <Link key={e.slug} className="entry" to={`/${e.section}/${e.slug}`}>
            <span className="date">{fmtShort(e.date)}</span>
            <span className="title">{e.title}</span>
            <span className="kind-tag">post</span>
          </Link>
        ))}
      </div>
    </>
  );
}
