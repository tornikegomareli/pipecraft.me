import Loading from "../components/Loading";
import Rows from "../components/Rows";
import { useFetch } from "../hooks/useFetch";
import { type PostsBySection, formatMonthYear } from "../lib/posts";

export default function Projects() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");

  return (
    <div className="enter">
      <header className="head rise">
        <h1>Projects</h1>
      </header>
      {loading ? (
        <Loading />
      ) : (
        <Rows
          rows={(data?.projects ?? []).map((p) => ({
            key: p.slug,
            title: p.title,
            sub: formatMonthYear(p.date),
            to: `/projects/${p.slug}`,
          }))}
        />
      )}
    </div>
  );
}
