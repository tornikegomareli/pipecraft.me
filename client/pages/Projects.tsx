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

export default function Projects() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  if (loading) return <div className="loading-state">loading...</div>;
  const projects = data?.projects || [];

  return (
    <>
      <div className="intro">
        <h1>Projects</h1>
        <p>Write-ups on things I've built professionally and on the side.</p>
      </div>
      {projects.length > 0 ? (
        <div className="entries">
          {projects.map((p) => (
            <Link key={p.slug} className="entry" to={`/${p.section}/${p.slug}`}>
              <span className="date">{fmtShort(p.date)}</span>
              <span className="title">{p.title}</span>
              <span className="kind-tag">project</span>
            </Link>
          ))}
        </div>
      ) : (
        <p>Nothing here yet.</p>
      )}
    </>
  );
}
