import Loading from "../components/Loading";
import TalkRow from "../components/TalkRow";
import { useFetch } from "../hooks/useFetch";
import type { PostsBySection } from "../lib/posts";

export default function Talks() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  return (
    <>
      <h1 className="page-title">Talks</h1>
      {loading ? (
        <Loading />
      ) : (
        <ul className="rows">
          {(data?.talks ?? []).map((t) => (
            <TalkRow key={t.slug} slug={t.slug} title={t.title} date={t.date} youtubeId={t.youtubeId} />
          ))}
        </ul>
      )}
    </>
  );
}
