import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TalksStrip, WorkCard, WritingIndex } from "../components/Cards";
import ContactModal from "../components/ContactModal";
import Peek from "../components/Peek";
import Rows from "../components/Rows";
import { useFetch } from "../hooks/useFetch";
import { type PostsBySection, writing } from "../lib/posts";
import { WORK } from "../lib/work";

const FILTERS = [
  { path: "/", label: "All" },
  { path: "/apps", label: "Apps" },
  { path: "/oss", label: "Open source" },
  { path: "/writing", label: "Writing" },
  { path: "/talks", label: "Talks" },
];

const LINKS = [
  { label: "X", href: "https://x.com/tornikegomareli" },
  { label: "GitHub", href: "https://github.com/tornikegomareli" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tornikegomareli" },
  { label: "YouTube", href: "https://www.youtube.com/@Devtherapy" },
];

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
}

const SHOWN = new Set(WORK.map((w) => w.href.toLowerCase()));

function Intro({ onContact }: { onContact: () => void }) {
  const side = useRef<HTMLElement>(null);

  // If the intro is taller than the window, it scrolls with the page until its end shows, then stays
  useEffect(() => {
    const el = side.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--top", `${Math.min(24, window.innerHeight - el.offsetHeight - 24)}px`);
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <header ref={side} className="side">
      <div className="who rise">
        <img className="me" src="/media/me.jpg" width={62} height={62} alt="" />
        <div>
          <h1>Tornike Gomareli</h1>
          <p>Applied AI Engineer</p>
          <p>macOS, iOS and Apple platforms</p>
        </div>
      </div>
      <div className="story rise" style={{ "--i": 2 } as CSSProperties}>
        <p>I've spent over 10 years designing and engineering software and developer tools for Apple platforms.</p>
        <p>
          I'm Technical Lead at{" "}
          <Peek href="https://techzy.app" icon="/media/icons/techzy.png">
            Techzy
          </Peek>
          , building an end-to-end AI shelf recognition system with{" "}
          <Peek href="https://www.coca-cola.com/ge/ka" icon="/media/icons/cocacola.png">
            Coca-Cola Bottlers Georgia
          </Peek>
          , from custom hardware and{" "}
          <Peek href="https://www.ultralytics.com/yolo" icon="/media/icons/yolo.svg">
            YOLO
          </Peek>{" "}
          models to reliable computer vision in real stores.
        </p>
        <p>
          I'm also co-founder of{" "}
          <Peek href="https://insanearts.io" icon="/media/icons/insanearts.svg">
            InsaneArts
          </Peek>
          , where we craft Apple software, including{" "}
          <Peek href="https://drooop.app" icon="/media/icons/drooop.png" media="drooop">
            <span className="drooop">drooop</span>
          </Peek>
          ,{" "}
          <Peek href="https://opies.io" icon="/media/icons/opie.png" media="opie">
            Opie
          </Peek>
          ,{" "}
          <Peek href="https://atlas.insanearts.io" icon="/media/icons/atlas.png" media="atlas">
            Atlas
          </Peek>
          , and{" "}
          <Peek href="https://usetalkify.app" icon="/media/icons/talkify.png" media="talkify">
            Talkify
          </Peek>
          .
        </p>
        <p>
          Previously, I led iOS engineering at{" "}
          <Peek href="https://bankofgeorgia.ge" icon="/media/icons/bankofgeorgia.png">
            Bank of Georgia
          </Peek>
          , rearchitecting an app used by 700,000 people daily. My earlier work spans live streaming, virtual
          instruments, and{" "}
          <Peek href="https://developer.apple.com/metal/" icon="/media/icons/metal.png">
            Metal
          </Peek>{" "}
          graphics programming.
        </p>
        <p>
          Today, I'm an AI ambassador focused on agentic engineering, automation, and developer tools. I maintain open
          source projects with 2,500+ GitHub stars, host the{" "}
          <Peek href="https://devtherapy.ge" icon="/media/icons/devtherapy.png">
            Devtherapy
          </Peek>{" "}
          podcast, and co-organize{" "}
          <Peek href="https://hacktoberfest.ge" icon="/media/icons/hacktoberfest.png">
            Hacktoberfest Georgia
          </Peek>
          .
        </p>
      </div>
      <nav className="links rise" style={{ "--i": 3 } as CSSProperties} aria-label="Contact">
        <button type="button" onClick={onContact}>
          Email
        </button>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default function Home() {
  const { pathname } = useLocation();
  const [contactOpen, setContactOpen] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const { data: posts } = useFetch<PostsBySection>("/api/posts");
  const { data: repos } = useFetch<Repo[]>("/api/projects");
  const filter = FILTERS.some((f) => f.path === pathname) ? pathname : "/";
  const all = filter === "/";

  let i = 0;
  const cards: ReactNode[] = [];
  for (const work of WORK) {
    if (all || (filter === "/apps" && work.kind === "app") || (filter === "/oss" && work.kind === "oss")) {
      cards.push(<WorkCard key={work.key} work={work} index={i++} />);
    }
  }
  const more = (repos ?? [])
    .filter((r) => !SHOWN.has(r.html_url.toLowerCase()))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 12);
  if ((all || filter === "/oss") && more.length) {
    cards.push(
      <div key="more" className="card full list" style={{ "--i": i++ } as CSSProperties}>
        <Rows
          rows={[
            ...more.map((r) => ({
              key: r.name,
              title: r.name,
              sub: [`${r.stargazers_count.toLocaleString("en-US")} stars`, r.description].filter(Boolean).join(" · "),
              href: r.html_url,
            })),
            { key: "all", title: "Everything on GitHub", href: "https://github.com/tornikegomareli?tab=repositories" },
          ]}
        />
      </div>,
    );
  }
  const articles = writing(posts);
  if ((all || filter === "/writing") && articles.length) {
    cards.push(<WritingIndex key="writing" posts={articles} index={i++} />);
  }
  const talks = posts?.talks ?? [];
  if ((all || filter === "/talks") && talks.length) {
    cards.push(<TalksStrip key="talks" talks={talks} index={i++} />);
  }

  return (
    <div className="home enter">
      <Intro onContact={() => setContactOpen(true)} />
      <main className="feed">
        <nav className="chips rise" style={{ "--i": 1 } as CSSProperties} aria-label="Filter">
          {FILTERS.map((f) => (
            <Link
              key={f.path}
              to={f.path}
              className="chip"
              aria-current={f.path === filter ? "page" : undefined}
              onClick={() => setFiltered(true)}
            >
              {f.label}
            </Link>
          ))}
          <a className="chip" href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
        {/* Cards rise in on the first visit; after a filter change they appear at once */}
        <div key={filter} className={filtered ? "grid instant" : "grid"}>
          {cards}
        </div>
      </main>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
