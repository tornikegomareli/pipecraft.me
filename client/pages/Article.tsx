import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PretextArticle from "../components/PretextArticle";
import { useFetch } from "../hooks/useFetch";

interface Post {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  section: string;
  content: string;
  readingTime: number;
}

function fmtShort(s: string): string {
  const d = new Date(s);
  const m = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const y = String(d.getFullYear()).slice(2);
  return `${m} ${String(d.getDate()).padStart(2, "0")}, ${y}`;
}

export default function Article() {
  const { section, slug } = useParams<{ section: string; slug: string }>();
  const { data: post, loading, error } = useFetch<Post>(
    `/api/posts/${section}/${slug}`,
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section, slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Tornike Gomareli`;
    return () => {
      document.title = "Tornike Gomareli";
    };
  }, [post]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (loading) return <div className="loading-state">loading...</div>;
  if (error || !post) {
    return (
      <div className="error-state">
        <h1>Post not found</h1>
        <Link to="/">back</Link>
      </div>
    );
  }

  const githubEditUrl = `https://github.com/tornikegomareli/pipecraft.me/edit/main/${post.section}/${post.slug}/index.md`;

  return (
    <>
      <div className="progress" style={{ width: `${progress}%` }} />
      <Link to="/" className="back-link">
        ← back
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
      <PretextArticle html={post.content} />
      <div className="article-foot">
        <a href={githubEditUrl} target="_blank" rel="noreferrer">
          edit on github
        </a>
        <Link to="/">more writing →</Link>
      </div>
    </>
  );
}
