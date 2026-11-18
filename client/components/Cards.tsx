import { type CSSProperties, useEffect, useRef, useState } from "react";
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

const OUT = (
  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M2.5 7.5 7.5 2.5M3.5 2.5h4v4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PLAY = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);

export function WorkCard({ work, index }: { work: Work; index: number }) {
  return (
    <a
      href={work.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${work.name}: ${work.line}`}
      className={work.wide ? "card full" : "card"}
      style={{ "--i": Math.min(index, 10), aspectRatio: work.shape } as CSSProperties}
    >
      <span className="stage">
        <Loop name={work.media} className="reel" />
      </span>
      <span className="name">
        {work.key === "drooop" ? <span className="drooop">drooop</span> : work.name}
        {OUT}
      </span>
      <span className="edge" />
    </a>
  );
}

const picture = (p: PostItem) =>
  p.section === "talks" ? `https://i.ytimg.com/vi_webp/${p.youtubeId}/maxresdefault.webp` : p.cover;

// Every article in one list. The hovered or focused one shows its picture beside the list.
export function WritingIndex({ posts, index }: { posts: PostItem[]; index: number }) {
  const [active, setActive] = useState(0);
  const shown = posts[active];
  const pic = shown && picture(shown);
  return (
    <div className="card full ix" style={{ "--i": Math.min(index, 10) } as CSSProperties}>
      <div className="ix-list">
        <p className="ix-head">Writing</p>
        <ul>
          {posts.map((p, i) => (
            <li key={`${p.section}/${p.slug}`}>
              <Link
                to={`/${p.section}/${p.slug}`}
                className={i === active ? "ix-row on" : "ix-row"}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="ix-title">{p.title}</span>
                <time className="ix-date" dateTime={p.date}>
                  {formatMonthYear(p.date)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="ix-preview" aria-hidden="true">
        {shown &&
          (pic ? (
            <img src={pic} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="ix-quote">{shown.spoiler ?? shown.title}</span>
          ))}
      </div>
      <span className="edge" />
    </div>
  );
}

export function TalksStrip({ talks, index }: { talks: PostItem[]; index: number }) {
  return (
    <div className="card full ts" style={{ "--i": Math.min(index, 10) } as CSSProperties}>
      <p className="ix-head">Talks</p>
      <ul className="ts-row">
        {talks.map((t) => (
          <li key={t.slug}>
            <Link to={`/talks/${t.slug}`} className="ts-item">
              <span className="ts-thumb">
                <img src={picture(t)} alt="" loading="lazy" />
                <span className="ts-play">{PLAY}</span>
              </span>
              <span className="ts-title">{t.title}</span>
              <time className="ts-date" dateTime={t.date}>
                {formatMonthYear(t.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      <span className="edge" />
    </div>
  );
}
