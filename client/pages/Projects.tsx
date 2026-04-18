import { useFetch } from "../hooks/useFetch";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

export default function Projects() {
  const { data, loading } = useFetch<Repo[]>("/api/repos");

  if (loading) return <div className="loading-state">loading...</div>;
  const repos = data || [];

  return (
    <>
      <div className="intro">
        <h1>Projects</h1>
        <p>Open-source things I&rsquo;ve built or am still breaking.</p>
      </div>
      <div className="projects-list">
        {repos.map((p) => (
          <a
            key={p.name}
            className="project-row"
            href={p.html_url}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <div className="name">{p.name}</div>
              {p.description && <div className="desc">{p.description}</div>}
            </span>
            <span className="lang">{p.language || ""}</span>
            <span className="stars">★ {p.stargazers_count}</span>
          </a>
        ))}
      </div>
    </>
  );
}
