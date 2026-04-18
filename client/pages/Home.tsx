import { Link } from "react-router-dom";
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

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

type PostsBySection = Record<string, PostItem[]>;

interface HomeData {
  posts: PostsBySection;
  repos: Repo[];
}

function fmtShort(s: string): string {
  const d = new Date(s);
  const m = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const y = String(d.getFullYear()).slice(2);
  return `${m} ${String(d.getDate()).padStart(2, "0")}, ${y}`;
}

export default function Home() {
  const { data, loading } = useFetch<HomeData>("/api/home");
  const posts = data?.posts ?? null;
  const repos = data?.repos ?? null;

  if (loading) return <div className="loading-state">loading...</div>;
  if (!posts) return null;

  const essays = posts.essays || [];
  const blog = posts.posts || [];
  const talks = (posts.talks || []).slice(0, 4);
  const projects = (repos || []).slice(0, 6);

  return (
    <>
      <div className="intro">
        <h1>Tornike Gomareli — software engineer</h1>
        <p>
          Builder, developer evangelist, technical agnostic. I write about
          concurrency, craft, and learning how to think better. Host of the
          Devtherapy podcast.
        </p>
        <div className="links">
          <a
            href="https://tornikegomareli.substack.com/"
            target="_blank"
            rel="noreferrer"
          >
            newsletter
          </a>
          <a
            href="https://www.youtube.com/@Devtherapy"
            target="_blank"
            rel="noreferrer"
          >
            devtherapy
          </a>
          <a
            href="https://github.com/tornikegomareli"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
          <a href="mailto:tornike.gomareli@gmail.com">email</a>
        </div>
      </div>

      {essays.length > 0 && (
        <>
          <div className="section-label">
            <span>Essays</span>
            <span className="count">{essays.length}</span>
          </div>
          <div className="entries">
            {essays.map((e) => (
              <Link
                key={e.slug}
                className="entry"
                to={`/${e.section}/${e.slug}`}
              >
                <span className="date">{fmtShort(e.date)}</span>
                <span className="title">{e.title}</span>
                <span className="kind-tag">essay</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {blog.length > 0 && (
        <>
          <div className="section-label">
            <span>Posts</span>
            <span className="count">{blog.length}</span>
          </div>
          <div className="entries">
            {blog.map((e) => (
              <Link
                key={e.slug}
                className="entry"
                to={`/${e.section}/${e.slug}`}
              >
                <span className="date">{fmtShort(e.date)}</span>
                <span className="title">{e.title}</span>
                <span className="kind-tag">post</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {talks.length > 0 && (
        <>
          <div className="section-label">
            <span>Talks</span>
            <Link to="/talks" className="count">
              see all →
            </Link>
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
      )}

      {projects.length > 0 && (
        <>
          <div className="section-label">
            <span>Projects</span>
            <Link to="/projects" className="count">
              see all →
            </Link>
          </div>
          <div className="projects-list">
            {projects.map((p) => (
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
      )}
    </>
  );
}
