import { Link } from "react-router-dom";

interface TalkCardProps {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  section: string;
  youtubeId?: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TalkCard({
  slug,
  title,
  date,
  spoiler,
  section,
  youtubeId,
}: TalkCardProps) {
  const thumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    : null;

  return (
    <Link to={`/${section}/${slug}`} className="talk-card">
      {thumbnail && (
        <div className="talk-card-thumb">
          <img src={thumbnail} alt={title} loading="lazy" />
          <div className="talk-card-play">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      <div className="talk-card-info">
        <h3 className="talk-card-title">{title}</h3>
        <div className="talk-card-meta">
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
        {spoiler && <p className="talk-card-spoiler">{spoiler}</p>}
      </div>
    </Link>
  );
}
