import { type CSSProperties, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useFetch } from "../hooks/useFetch";
import { type Post, formatFullDate } from "../lib/posts";

export default function Talk() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, loading, error } = useFetch<Post>(`/api/posts/talks/${slug}`);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  return (
    <article className="enter">
      <header className="head rise">
        <h1>{post.title}</h1>
        <p>
          <time dateTime={post.date}>{formatFullDate(post.date)}</time>
        </p>
      </header>
      {post.youtubeId && (
        <div className="video wide rise" style={{ "--i": 1 } as CSSProperties}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}`}
            title={post.title}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {post.content && (
        <div
          className="prose rise"
          style={{ "--i": 2 } as CSSProperties}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered markdown
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </article>
  );
}
