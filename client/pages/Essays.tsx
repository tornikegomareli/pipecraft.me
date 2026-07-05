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

export default function Essays() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  if (loading) return <div className="loading-state">loading...</div>;
  const essays = data?.essays || [];

  return (
    <>
      <div className="intro">
        <h1>Essays</h1>
        <p>Longer pieces about craft, thinking, and how software actually gets built.</p>
      </div>
      <div className="entries">
        {essays.map((e) => (
          <Link key={e.slug} className="entry" to={`/${e.section}/${e.slug}`}>
            <span className="date">{fmtShort(e.date)}</span>
            <span className="title">{e.title}</span>
            <span className="kind-tag">essay</span>
          </Link>
        ))}
      </div>
    </>
  );
}
