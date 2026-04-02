import { Link } from "react-router-dom";

interface PostCardProps {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  section: string;
  readingTime: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({
  slug,
  title,
  date,
  spoiler,
  section,
  readingTime,
}: PostCardProps) {
  return (
    <article className="post-card">
      <Link to={`/${section}/${slug}`} className="post-card-link">
        <h3 className="post-card-title">{title}</h3>
        <div className="post-card-meta">
          <time dateTime={date}>{formatDate(date)}</time>
          <span className="meta-dot" />
          <span>{readingTime} min read</span>
        </div>
        {spoiler && <p className="post-card-spoiler">{spoiler}</p>}
      </Link>
    </article>
  );
}
