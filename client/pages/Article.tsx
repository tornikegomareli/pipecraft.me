import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import PretextArticle from "../components/PretextArticle";
import { useFetch } from "../hooks/useFetch";
import { type Post, formatFullDate } from "../lib/posts";

export default function Article() {
  const { section, slug } = useParams<{ section: string; slug: string }>();
  const { data: post, loading, error } = useFetch<Post>(`/api/posts/${section}/${slug}`);

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
  if (error || !post) return <h1 className="page-title">Not found</h1>;

  const githubEditUrl = `https://github.com/tornikegomareli/pipecraft.me/edit/main/${post.section}/${post.slug}/index.md`;

  return (
    <article>
      <header className="article-head">
        <h1>{post.title}</h1>
        {post.spoiler && <p className="deck">{post.spoiler}</p>}
        <p className="meta">
          <time dateTime={post.date}>{formatFullDate(post.date)}</time> · {post.readingTime} min read
        </p>
      </header>
      <PretextArticle html={post.content} />
      <footer className="article-foot">
        <a href={githubEditUrl} target="_blank" rel="noreferrer">
          Edit on GitHub
        </a>
      </footer>
    </article>
  );
}
