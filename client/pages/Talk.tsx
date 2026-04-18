import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

interface Post {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  section: string;
  content: string;
  readingTime: number;
  youtubeId?: string;
}

function fmtShort(s: string): string {
  const d = new Date(s);
  const m = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const y = String(d.getFullYear()).slice(2);
  return `${m} ${String(d.getDate()).padStart(2, "0")}, ${y}`;
}

export default function Talk() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, loading, error } = useFetch<Post>(
    `/api/posts/talks/${slug}`,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Tornike Gomareli`;
    return () => {
      document.title = "Tornike Gomareli";
    };
  }, [post]);

  if (loading) return <div className="loading-state">loading...</div>;
  if (error || !post) {
    return (
      <div className="error-state">
        <h1>Talk not found</h1>
        <Link to="/talks">back to talks</Link>
      </div>
    );
  }

  return (
    <>
      <Link to="/talks" className="back-link">
        ← back to talks
      </Link>
      <header className="article-head">
        <h1>{post.title}</h1>
        {post.spoiler && <p className="sub">{post.spoiler}</p>}
        <div className="meta">
          <span>{fmtShort(post.date)}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </header>
      {post.youtubeId ? (
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid var(--rule)",
            marginBottom: 32,
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}`}
            title={post.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allow="accelerometer; autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          style={{
            aspectRatio: "16/9",
            background: "var(--paper-2)",
            border: "1px solid var(--rule)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink-3)",
            fontSize: 12,
            marginBottom: 32,
          }}
        >
          recording coming soon
        </div>
      )}
      {post.content && (
        <div
          className="prose"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered markdown
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </>
  );
}
