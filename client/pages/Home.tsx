import Footer from "../components/Footer";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import RepoCard from "../components/RepoCard";
import TalkCard from "../components/TalkCard";
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

export default function Home() {
  const { data: posts, loading } = useFetch<PostsBySection>("/api/posts");
  const { data: repos } = useFetch<Repo[]>("/api/repos");

  return (
    <div className="layout">
      <Header />
      <main className="home">
        <section className="hero">
          <div className="hero-avatar">
            <img src="/pic.jpeg" alt="Tornike Gomareli" />
          </div>
          <div className="hero-text">
            <p className="hero-tagline">
              Builder, Developer Evangelist, Technical Agnostic.
              <br />
              Always learn how to think better.
            </p>
            <div className="hero-links">
              <a
                href="https://tornikegomareli.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-link"
              >
                Newsletter
              </a>
              <a
                href="https://www.youtube.com/@Devtherapy"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-link"
              >
                Devtherapy Podcast
              </a>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          posts && (
            <>
              {posts.essays && posts.essays.length > 0 && (
                <section className="content-section">
                  <h2 className="section-title">Essays</h2>
                  <div className="post-list">
                    {posts.essays.map((post) => (
                      <PostCard key={post.slug} {...post} />
                    ))}
                  </div>
                </section>
              )}

              {posts.posts && posts.posts.length > 0 && (
                <section className="content-section">
                  <h2 className="section-title">Blog Posts</h2>
                  <div className="post-list">
                    {posts.posts.map((post) => (
                      <PostCard key={post.slug} {...post} />
                    ))}
                  </div>
                </section>
              )}

              {posts.talks && posts.talks.length > 0 && (
                <section className="content-section" id="talks">
                  <h2 className="section-title">Talks</h2>
                  <div className="talks-grid">
                    {posts.talks.map((talk) => (
                      <TalkCard key={talk.slug} {...talk} />
                    ))}
                  </div>
                </section>
              )}

              {repos && repos.length > 0 && (
                <section className="content-section">
                  <h2 className="section-title">Projects</h2>
                  <div className="repo-grid">
                    {repos.map((repo) => (
                      <RepoCard key={repo.name} {...repo} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
