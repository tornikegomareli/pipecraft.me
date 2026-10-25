import { Link } from "react-router-dom";
import { formatMonthYear } from "../lib/posts";

interface TalkRowProps {
  slug: string;
  title: string;
  date: string;
  youtubeId?: string;
}

export default function TalkRow({ slug, title, date, youtubeId }: TalkRowProps) {
  return (
    <li>
      <Link to={`/talks/${slug}`} className="row talk">
        <span className="talk-thumb">
          {youtubeId && <img src={`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`} alt="" loading="lazy" />}
        </span>
        <span className="talk-text">
          <span className="row-title">{title}</span>
          <time className="row-meta" dateTime={date}>
            {formatMonthYear(date)}
          </time>
        </span>
      </Link>
    </li>
  );
}
