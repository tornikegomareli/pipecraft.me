import { type CSSProperties, type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PostCard, WorkCard } from "../components/Cards";
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
  return (
    <header className="side">
      <div className="who rise">
        <img className="me" src="/media/me.jpg" width={62} height={62} alt="" />
        <div>
          <h1>Tornike Gomareli</h1>
          <p>Applied AI Engineer</p>
          <p>macOS, iOS and Apple platforms</p>
        </div>
      </div>
      <div className="story rise" style={{ "--i": 2 } as CSSProperties}>
        <p>
          Now building{" "}
          <Peek href="https://drooop.app" icon="/media/icons/drooop.png" media="drooop">
            <span className="drooop">drooop</span>
          </Peek>
          ,{" "}
          <Peek href="https://atlas.insanearts.io" icon="/media/icons/atlas.png" media="atlas">
            Atlas
          </Peek>
          ,{" "}
          <Peek href="https://opies.io" icon="/media/icons/opie.png" media="opie">
            Opie
          </Peek>{" "}
          and{" "}
          <Peek href="https://usejolt.app" icon="/media/icons/jolt.png" media="jolt">
            Jolt
          </Peek>{" "}
          at{" "}
          <Peek href="https://insanearts.io" icon="/media/icons/insanearts.svg">
            InsaneArts
          </Peek>
          , small apps for the Mac and iPhone that sweat the details nobody asks for.
        </p>
        <p>
          By day, Technical Lead at Techzy, teaching cameras to spot every Coca-Cola bottle in a fridge, 600,000 times a
          day.
        </p>
        <p>Before, I rebuilt the home screen of Bank of Georgia's app, used by 700,000 people every day.</p>
        <p>Way before, live TV streaming, a virtual piano and Metal graphics on iOS and tvOS.</p>
        <p>I work AI first and automate everything I can.</p>
        <p>
          On the side, open source with 2,500+ stars, the Devtherapy podcast, Apple Developers Georgia and Hacktoberfest
          Georgia.
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
  if (all || filter === "/writing") {
    for (const post of writing(posts))
      cards.push(<PostCard key={`${post.section}/${post.slug}`} post={post} index={i++} />);
  }
  if (all || filter === "/talks") {
    for (const talk of posts?.talks ?? []) cards.push(<PostCard key={`talks/${talk.slug}`} post={talk} index={i++} />);
  }

  return (
    <div className="home enter">
      <Intro onContact={() => setContactOpen(true)} />
      <main className="feed">
        <nav className="chips rise" style={{ "--i": 1 } as CSSProperties} aria-label="Filter">
          {FILTERS.map((f) => (
            <Link key={f.path} to={f.path} className="chip" aria-current={f.path === filter ? "page" : undefined}>
              {f.label}
            </Link>
          ))}
          <a className="chip" href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
        <div key={filter} className="grid">
          {cards}
        </div>
      </main>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
