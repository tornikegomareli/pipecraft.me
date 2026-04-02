import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Article() {
  const { section, slug } = useParams<{ section: string; slug: string }>();
  const { data: post, loading, error } = useFetch<Post>(
    `/api/posts/${section}/${slug}`,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section, slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Tornike Gomareli`;
    }
    return () => {
      document.title = "Tornike Gomareli";
    };
  }, [post]);

  if (loading) {
    return (
      <div className="layout">
        <Header />
        <main className="article-page">
          <div className="loading-state">Loading...</div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="layout">
        <Header />
        <main className="article-page">
          <div className="error-state">
            <h1>Post not found</h1>
            <Link to="/">Back home</Link>
          </div>
        </main>
      </div>
    );
  }

  const githubEditUrl = `https://github.com/tornikegomareli/pipecraft.me/edit/main/${post.section}/${post.slug}/index.md`;

  return (
    <div className="layout">
      <Header />
      <main className="article-page">
        <Link to="/" className="back-link">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All posts
        </Link>

        <article className="article">
          <header className="article-header">
            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="meta-dot" />
              <span>{post.readingTime} min read</span>
            </div>
          </header>

          <PretextArticle html={post.content} />

          <footer className="article-footer">
            <a
              href={githubEditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="edit-link"
            >
              Edit on GitHub
            </a>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
