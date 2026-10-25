import { Link } from "react-router-dom";
import { type PostItem, formatMonthYear } from "../lib/posts";

export default function PostList({ posts }: { posts: PostItem[] }) {
  return (
    <ul className="rows">
      {posts.map((p) => (
        <li key={`${p.section}/${p.slug}`}>
          <Link className="row" to={`/${p.section}/${p.slug}`}>
            <span className="row-title">{p.title}</span>
            <time className="row-meta" dateTime={p.date}>
              {formatMonthYear(p.date)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
