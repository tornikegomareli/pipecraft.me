import { type CSSProperties, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import PretextArticle from "../components/PretextArticle";
import { useFetch } from "../hooks/useFetch";
import { type Post, formatFullDate } from "../lib/posts";

export default function Article() {
  const { section, slug } = useParams<{ section: string; slug: string }>();
  const { data: post, loading, error } = useFetch<Post>(`/api/posts/${section}/${slug}`);
  const [copied, setCopied] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section, slug]);

  useEffect(() => {
    if (post) document.title = `${post.title} — Tornike Gomareli`;
    return () => {
      document.title = "Tornike Gomareli";
    };
  }, [post]);

  if (loading) return <Loading />;
  if (error || !post) {
    return (
      <header className="head enter">
        <h1>Not found</h1>
      </header>
    );
  }

  const githubEditUrl = `https://github.com/tornikegomareli/pipecraft.me/edit/main/${post.section}/${post.slug}/index.md`;

  // The share sheet where the browser has one, otherwise the link goes to the clipboard
  const share = () => {
    const url = window.location.href;
    if (navigator.share) {
      // Closing the share sheet rejects the promise
      navigator.share({ title: post.title, url }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="enter">
      <header className="head rise">
        <h1>{post.title}</h1>
        <p>
          <time dateTime={post.date}>{formatFullDate(post.date)}</time> · {post.readingTime} min read
        </p>
      </header>
      <div className="rise" style={{ "--i": 1 } as CSSProperties}>
        <PretextArticle html={post.content} />
      </div>
      <footer className="article-foot rise" style={{ "--i": 2 } as CSSProperties}>
        <a href={githubEditUrl} target="_blank" rel="noreferrer">
          Edit on GitHub
        </a>
        <button type="button" onClick={share} aria-live="polite">
          {copied ? "Copied" : "Share"}
        </button>
      </footer>
    </article>
  );
}
