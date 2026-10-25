import Loading from "../components/Loading";
import { useFetch } from "../hooks/useFetch";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
}

export default function Oss() {
  const { data, loading } = useFetch<Repo[]>("/api/projects");

  return (
    <>
      <h1 className="page-title">Open source</h1>
      {loading ? (
        <Loading />
      ) : (
        <ul className="rows">
          {(data ?? []).map((r) => (
            <li key={r.name}>
              <a className="row" href={r.html_url} target="_blank" rel="noreferrer">
                <span className="row-title">{r.name}</span>
                <span className="row-meta">★ {r.stargazers_count.toLocaleString("en-US")}</span>
                {r.description && <span className="row-sub">{r.description}</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
