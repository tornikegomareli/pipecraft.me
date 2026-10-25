import { useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "../components/ContactModal";
import PostList from "../components/PostList";
import TalkRow from "../components/TalkRow";
import { useFetch } from "../hooks/useFetch";
import { type PostsBySection, writing } from "../lib/posts";

const APPS = [
  {
    name: "Opie",
    tagline: "Your actions, around the cursor.",
    url: "https://opies.io",
    icon: "/icons/opie.webp",
  },
  {
    name: "Jolt",
    tagline: "The intelligent launcher for your Mac.",
    url: "https://usejolt.app",
    icon: "/icons/jolt.webp",
  },
  {
    name: "Talkify",
    tagline: "Speak. It's written.",
    url: "https://usetalkify.app",
    icon: "/icons/talkify.webp",
  },
  {
    name: "drooop",
    tagline: "The missing layer between your Mac and iPhone.",
    url: "https://drooop.app",
    icon: "/icons/drooop.webp",
    soon: true,
  },
];

function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 8 14" aria-hidden="true">
      <path d="M1.5 1.5 7 7l-5.5 5.5" />
    </svg>
  );
}

export default function Home() {
  const { data } = useFetch<PostsBySection>("/api/posts");
  const [contactOpen, setContactOpen] = useState(false);
  const latest = writing(data).slice(0, 3);
  const talks = (data?.talks ?? []).slice(0, 2);

  return (
    <>
      <section className="hero">
        <img className="avatar" src="/avatar.jpg" alt="" />
        <h1>Tornike Gomareli</h1>
        <p>
          I run{" "}
          <a href="https://insanearts.io" target="_blank" rel="noreferrer">
            InsaneArts
          </a>
          , an independent studio that makes Mac apps.
        </p>
      </section>

      <ul className="apps">
        {APPS.map((app) => (
          <li key={app.name}>
            <a className="app" href={app.url} target="_blank" rel="noreferrer">
              <img className="app-icon" src={app.icon} alt="" />
              <span className="app-text">
                <span className="app-name">
                  {app.name}
                  {app.soon && <span className="soon">Coming soon</span>}
                </span>
                <span className="app-tagline">{app.tagline}</span>
              </span>
              <svg className="app-arrow" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3.5 8.5l5-5M4.5 3.5h4v4" />
              </svg>
            </a>
          </li>
        ))}
      </ul>

      {latest.length > 0 && (
        <section className="section">
          <h2>
            <Link to="/writing">
              Writing
              <Chevron />
            </Link>
          </h2>
          <PostList posts={latest} />
        </section>
      )}

      {talks.length > 0 && (
        <section className="section">
          <h2>
            <Link to="/talks">
              Talks
              <Chevron />
            </Link>
          </h2>
          <ul className="rows">
            {talks.map((t) => (
              <TalkRow key={t.slug} slug={t.slug} title={t.title} date={t.date} youtubeId={t.youtubeId} />
            ))}
          </ul>
        </section>
      )}

      <nav className="dock">
        <Link to="/" aria-current="page">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6.5 19a6 6 0 0 1 11 0" />
          </svg>
          Profile
        </Link>
        <Link to="/writing">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5c-2-1.5-4.5-2-7-2v16c2.5 0 5 .5 7 2 2-1.5 4.5-2 7-2V3c-2.5 0-5 .5-7 2z" />
            <path d="M12 5v16" />
          </svg>
          Writing
        </Link>
        <a href="https://tornikegomareli.substack.com/" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          Newsletter
        </a>
        <button type="button" onClick={() => setContactOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4h16v12H8l-4 4V4z" />
            <path d="M8 9h8M8 12h5" />
          </svg>
          Contact
        </button>
      </nav>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
