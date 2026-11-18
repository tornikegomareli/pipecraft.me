import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { type PostItem, formatMonthYear } from "../lib/posts";
import type { Work } from "../lib/work";

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A silent loop that plays only while it is on screen. With reduced motion it stays on its poster.
export function Loop({ name, className }: { name: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || still()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={`/media/${name}.mp4`}
      poster={`/media/${name}.webp`}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}

function Caption({ icon, title, sub }: { icon?: ReactNode; title: ReactNode; sub: string }) {
  return (
    <span className="caption">
      {icon}
      <span className="caption-text">
        <span className="caption-title">{title}</span> <span className="caption-sub">{sub}</span>
      </span>
    </span>
  );
}

export function WorkCard({ work, index }: { work: Work; index: number }) {
  return (
    <a
      href={work.href}
      target="_blank"
      rel="noreferrer"
      className={work.wide ? "card full" : "card"}
      style={{ "--tint": work.tint, "--ratio": work.ratio, "--i": Math.min(index, 10) } as CSSProperties}
    >
      <Caption
        icon={work.icon && <img className="caption-icon" src={`/media/icons/${work.key}.png`} alt="" />}
        title={work.key === "drooop" ? <span className="drooop">drooop</span> : work.name}
        sub={work.line}
      />
      <span className="stage">
        <Loop name={work.media} className={work.portrait ? "shot portrait" : "shot"} />
      </span>
    </a>
  );
}

const YOUTUBE = (
  <svg className="source-icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="5" fill="#ff0033" />
    <path d="M10 8.5v7l6-3.5z" fill="#fff" />
  </svg>
);

// An article or a talk: a picture, where it lives, and its title
export function PostCard({ post, index }: { post: PostItem; index: number }) {
  const talk = post.section === "talks";
  const picture = talk ? `https://i.ytimg.com/vi_webp/${post.youtubeId}/maxresdefault.webp` : post.cover;
  return (
    <Link
      to={`/${post.section}/${post.slug}`}
      className="card post"
      style={{ "--i": Math.min(index, 10) } as CSSProperties}
    >
      <span className="note">
        {picture ? (
          <img className="note-picture" src={picture} alt="" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="note-picture note-type">{post.spoiler ?? post.title}</span>
        )}
        <span className="note-body">
          <span className="note-meta">
            <span className="note-source">
              {talk && YOUTUBE}
              {talk ? "Talk" : post.section === "essays" ? "Essay" : "Post"}
            </span>
            <time dateTime={post.date}>{formatMonthYear(post.date)}</time>
          </span>
          <span className="note-title">{post.title}</span>
          {!talk && <span className="note-sub">{post.readingTime} min read</span>}
        </span>
      </span>
    </Link>
  );
}
