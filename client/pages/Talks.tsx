import TalkRow from "../components/TalkRow";
import { useFetch } from "../hooks/useFetch";

interface PostItem {
  slug: string;
  title: string;
  date: string;
  spoiler?: string;
  section: string;
  readingTime: number;
  youtubeId?: string;
}

type PostsBySection = Record<string, PostItem[]>;

export default function Talks() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  if (loading) return <div className="loading-state">loading...</div>;
  const talks = data?.talks || [];

  return (
    <>
      <div className="intro">
        <h1>Talks</h1>
        <p>Recorded talks from meetups, podcasts, and conferences.</p>
      </div>
      <div className="talks-list">
        {talks.map((t) => (
          <TalkRow
            key={t.slug}
            slug={t.slug}
            title={t.title}
            date={t.date}
            spoiler={t.spoiler}
            youtubeId={t.youtubeId}
          />
        ))}
      </div>
    </>
  );
}
