import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "../components/ContactModal";
import ContributionGraph from "../components/ContributionGraph";
import TalkRow from "../components/TalkRow";
import { useFetch } from "../hooks/useFetch";

// maplibre-gl is heavy (~1MB) — only the homepage needs it, so keep it out of the main bundle
const HeroMap = lazy(() => import("../components/HeroMap"));

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
  forks_count: number;
  language: string | null;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

type PostsBySection = Record<string, PostItem[]>;

interface HomeData {
  posts: PostsBySection;
  repos: Repo[];
  contributions: ContributionDay[];
}

const SHIPPED_APPS = [
  {
    name: "Coca-Cola Rewards Georgia",
    url: "https://apps.apple.com/ge/app/coca-cola-rewards-georgia/id6733216376",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/97/f2/10/97f210be-326f-c768-c55f-d60cc5bcdead/AppIcon-0-0-1x_U007ephone-0-7-0-85-220.png/512x512bb.jpg",
  },
  {
    name: "Silk Rewards",
    url: "https://apps.apple.com/ge/app/silk-rewards/id6748354536",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/1f/b0/79/1fb07997-bd27-2c3a-5f7e-20519e11b948/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  },
  {
    name: "Bank of Georgia",
    url: "https://apps.apple.com/us/app/bank-of-georgia/id1159368231",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/76/2a/24/762a244b-3d46-2464-1ee4-1f7c2340d865/AppIcon-0-0-1x_U007ephone-0-7-0-sRGB-85-220.png/512x512bb.jpg",
  },
  {
    name: "Urban Sports Club",
    url: "https://apps.apple.com/ge/app/urban-sports-club/id998362348",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2f/3d/a9/2f3da908-47e8-94fc-b7d8-9820cdef76e7/AppIcon-Release-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.jpg",
  },
  {
    name: "ShopThing",
    url: "https://apps.apple.com/us/app/shopthing-shop-luxury-deals/id1522774665",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d3/e5/5b/d3e55b25-63f4-f661-5abc-c0d25e1a734f/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg",
  },
  {
    name: "SuperApp TNET",
    url: "https://apps.apple.com/ge/app/superapp-tnet/id6444474250",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/82/06/d3/8206d359-cf95-5056-6671-7288f8f53654/AppIcon-0-0-1x_U007ephone-0-1-0-sRGB-85-220.png/512x512bb.jpg",
  },
  {
    name: "Sheet Music Reader Halbestunde",
    url: "https://apps.apple.com/us/app/sheet-music-reader-halbestunde/id1519736220",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d4/68/09/d4680923-a030-731d-7ca4-e57376a2e555/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg",
  },
  {
    name: "TBC Bank Uzbekistan",
    url: "https://apps.apple.com/us/app/tbc-bank-uzbekistan/id1450503714",
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/bd/f9/76/bdf97613-ce5f-0319-d5c6-7f0fff2a801a/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg",
  },
];

const TALKS_STATIC = [
  {
    slug: "local-first-mobile",
    title: "Local First Mobile — A Different Way to Think About State",
    date: "2025-12-13",
    spoiler: "Exploring local-first architecture for mobile applications and rethinking state management",
    youtubeId: "mSNS7CgMMKw",
  },
  {
    slug: "hackers-learn-by-building",
    title: "Hackers Learn by Building, From Zero to Eval, Creating Lisp",
    date: "2025-12-01",
    spoiler: "Building a Lisp interpreter from scratch to understand fundamental programming concepts",
    youtubeId: "hNBlkEbHm0Q",
  },
  {
    slug: "devtherapy-gamejam-2025",
    title: "How to Land a Job in 2025 (Devtherapy GameJam 2025)",
    date: "2025-07-05",
    spoiler: "Tips and strategies for landing a tech job in 2025",
    youtubeId: "DjqKuEMWm7E",
  },
  {
    slug: "are-we-replaceable",
    title: "Are We Replaceable?",
    date: "2024-07-31",
    spoiler: "Exploring the future of software engineering in the age of AI",
    youtubeId: "DplNCCToDhc",
  },
];

const TECH_ICONS = [
  { name: "Swift", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
  { name: "Kotlin", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
  { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Rust", src: "https://cdn.simpleicons.org/rust/E43717" },
  { name: "Zig", src: "https://cdn.simpleicons.org/zig/F7A41D" },
  { name: "Flutter", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Bun", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg" },
  { name: "Claude", src: "https://cdn.simpleicons.org/claude/D97757" },
  { name: "OpenAI", src: "https://cdn.jsdelivr.net/npm/simple-icons@13/icons/openai.svg", invert: true },
  { name: "Gemini", src: "https://cdn.simpleicons.org/googlegemini/4796E3" },
];

function useTbilisiClock() {
  const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Tbilisi" });
  const [time, setTime] = useState(() => fmt.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(fmt.format(new Date())), 10000);
    return () => clearInterval(id);
  }, [fmt]);

  return time;
}

function useTypewriter(text: string, startDelay = 400, speed = 110) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, startDelay, speed]);

  return shown;
}

export default function Home() {
  const { data, loading } = useFetch<HomeData>("/api/home");
  const [contactOpen, setContactOpen] = useState(false);
  const time = useTbilisiClock();
  const typed = useTypewriter("I'm Tornike.");

  if (loading) return <div className="loading-state">loading...</div>;

  const talks = (data?.posts?.talks?.length ? data.posts.talks : TALKS_STATIC).slice(0, 4);
  const projects = data?.repos ?? [];
  const contributions = data?.contributions ?? [];

  return (
    <>
      <div className="hero">
        <div className="hero-map-wrap">
          <Suspense fallback={null}>
            <HeroMap />
          </Suspense>
          <div className="clock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" role="img" aria-label="Clock">
              <title>Tbilisi time</title>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <span>{time} GET</span>
          </div>
        </div>
        <div className="hero-body">
          <div className="hero-text">
            <div className="hello">Hello,</div>
            <h1 className="hero-title">
              <span className="ghost">I'm Tornike.</span>
              <span className="typed">{typed}</span>
            </h1>
          </div>
          <img className="hero-photo" src="/pic.jpeg" alt="Tornike Gomareli" />
        </div>
      </div>

      <p className="hero-intro">
        I love building. Swift is home, but I'm a generalist engineer at heart, and I reach for Rust, Zig, Go, or
        TypeScript when the problem asks for it. Today I'm deep into agentic engineering, and 10+ years of building
        software gave me fundamentals strong enough to pick up any stack. Understanding how things work under the hood
        is the whole point.
      </p>

      <div className="pills">
        <a className="pill" href="mailto:gomarelidevelopment@gmail.com">
          <svg viewBox="0 0 24 24" role="img" aria-label="Email">
            <title>Email</title>
            <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13zm2.2.5 7.3 6.1a1 1 0 0 0 1 0L19.8 6H4.2zM4 7.9v10.6c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V7.9l-7.24 6.04a2 2 0 0 1-2.52 0L4 7.9z" />
          </svg>
          gomarelidevelopment@gmail.com
        </a>
        <a className="pill" href="https://github.com/tornikegomareli" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 16 16" role="img" aria-label="GitHub">
            <title>GitHub</title>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          @tornikegomareli
        </a>
        <a className="pill" href="https://x.com/tornikegomareli" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" role="img" aria-label="X">
            <title>X</title>
            <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" />
          </svg>
          @tornikegomareli
        </a>
        <a className="pill" href="https://www.linkedin.com/in/tornikegomareli" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" role="img" aria-label="LinkedIn">
            <title>LinkedIn</title>
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
          </svg>
          tornikegomareli
        </a>
        <a className="pill" href="https://www.youtube.com/@Devtherapy" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" role="img" aria-label="YouTube">
            <title>YouTube</title>
            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
          </svg>
          @Devtherapy
        </a>
      </div>

      <section className="home-section">
        <h2>Open Source</h2>
        <p>
          I'm an active open source contributor and go by{" "}
          <a href="https://github.com/tornikegomareli" target="_blank" rel="noreferrer">
            @tornikegomareli
          </a>{" "}
          on GitHub, where 120+ repositories of the learn-by-building habit are public. A lot of what I build starts
          with curiosity about how something works under the hood. But I also love building tools for developers and
          productivity tools. Most of my current open source work is either developer tooling or libraries that simplify
          working in the Apple ecosystem.
        </p>

        <ContributionGraph days={contributions} />

        <h3>Shipped</h3>
        <p>Outside of my open source work, here are a few apps I've worked on, built, and shipped professionally:</p>
        <div className="apps">
          {SHIPPED_APPS.map((app) => (
            <a key={app.name} className="app-icon" href={app.url} target="_blank" rel="noreferrer" title={app.name}>
              <img src={app.icon} alt={app.name} loading="lazy" />
            </a>
          ))}
        </div>

        {projects.length > 0 && (
          <>
            <h3>Featured projects</h3>
            <div className="projects-grid">
              {projects.map((p) => (
                <a key={p.name} className="project-card" href={p.html_url} target="_blank" rel="noreferrer">
                  <div className="project-meta">
                    <span>{p.language || ""}</span>
                    <span>★ {p.stargazers_count.toLocaleString()}</span>
                  </div>
                  <div className="project-name">{p.name}</div>
                  {p.description && <div className="project-desc">{p.description}</div>}
                </a>
              ))}
            </div>
            <Link to="/projects" className="see-all">
              See all projects →
            </Link>
          </>
        )}
      </section>

      <section className="home-section">
        <h2>Talks</h2>
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
        <Link to="/talks" className="see-all">
          See all talks →
        </Link>
      </section>

      <section className="home-section">
        <h2>Devtherapy</h2>
        <p>
          I host{" "}
          <a href="https://www.youtube.com/@Devtherapy" target="_blank" rel="noreferrer">
            Devtherapy
          </a>
          , a podcast about engineering, developer experience, and engineering culture, recorded with engineers I
          admire. I also organize the Apple Developers Georgia community meetups in Tbilisi, and I'm a co-organizer and
          co-founder of Hacktoberfest, one of the biggest hackathons in Georgia.
        </p>
        <div className="cta-row">
          <a className="btn-accent" href="https://www.youtube.com/@Devtherapy" target="_blank" rel="noreferrer">
            Watch Devtherapy
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Play">
              <title>Play</title>
              <path d="M8 5v14l11-7z" />
            </svg>
          </a>
        </div>
      </section>

      <section className="home-section">
        <h2>Work</h2>
        <p>
          I'm Technical Lead at <b>Techzy</b>, currently leading a team building Georgia's first AI-powered shelf
          recognition system for retail, together with Coca-Cola Bottlers Georgia, from circuit board to software.
        </p>
      </section>

      <section className="home-section">
        <h2>Consulting</h2>
        <p>
          If you're stuck on a tough mobile architecture problem, need someone to audit an iOS codebase, or want to
          bring AI into your product, I'm available to help.
        </p>
        <div className="tech-icons">
          {TECH_ICONS.map((t) => (
            <img key={t.name} src={t.src} alt={t.name} style={t.invert ? { filter: "invert(1)" } : undefined} />
          ))}
        </div>
        <p>
          I also specialize in AI engineering of any kind: custom agentic workflows, RAG-based solutions, LLM
          integrations, and on-device intelligence, with a strong focus on developer experience and simplicity. If
          you're interested in working together, feel free to reach out!
        </p>
      </section>

      <nav className="bottom-nav">
        <Link to="/" className="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" role="img" aria-label="Profile">
            <title>Profile</title>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6.5 19a6 6 0 0 1 11 0" />
          </svg>
          Profile
        </Link>
        <Link to="/posts">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" role="img" aria-label="Blog">
            <title>Blog</title>
            <path d="M12 5c-2-1.5-4.5-2-7-2v16c2.5 0 5 .5 7 2 2-1.5 4.5-2 7-2V3c-2.5 0-5 .5-7 2z" />
            <path d="M12 5v16" />
          </svg>
          Blog
        </Link>
        <Link to="/essays">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" role="img" aria-label="Essays">
            <title>Essays</title>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Essays
        </Link>
        <a href="https://tornikegomareli.substack.com/" target="_blank" rel="noreferrer">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            role="img"
            aria-label="Newsletter"
          >
            <title>Newsletter</title>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          Newsletter
        </a>
        <button type="button" onClick={() => setContactOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" role="img" aria-label="Contact">
            <title>Contact</title>
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
