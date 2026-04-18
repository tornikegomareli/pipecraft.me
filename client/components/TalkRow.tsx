import { Link } from "react-router-dom";

interface TalkRowProps {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  youtubeId?: string;
  duration?: string;
}

function fmtShort(s: string): string {
  const d = new Date(s);
  const m = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const y = String(d.getFullYear()).slice(2);
  return `${m} ${String(d.getDate()).padStart(2, "0")}, ${y}`;
}

export default function TalkRow({
  slug,
  title,
  date,
  spoiler,
  youtubeId,
  duration,
}: TalkRowProps) {
  const thumb = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  return (
    <Link to={`/talks/${slug}`} className="talk-row">
      <div className="thumb">
        {thumb && (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <span className="play-overlay">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </span>
      </div>
      <div className="info">
        <span className="title">{title}</span>
        {spoiler && <span className="venue">{spoiler}</span>}
        <span className="date">{fmtShort(date)}</span>
      </div>
      {duration && <span className="dur">{duration}</span>}
    </Link>
  );
}
