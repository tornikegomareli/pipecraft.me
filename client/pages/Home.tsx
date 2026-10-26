import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ContactModal from "../components/ContactModal";
import Loading from "../components/Loading";
import Rows, { type Row } from "../components/Rows";
import { load, useFetch } from "../hooks/useFetch";
import { type PostsBySection, formatMonthYear, writing } from "../lib/posts";

const TABS = [
  { path: "/", label: "Apps" },
  { path: "/writing", label: "Writing" },
  { path: "/talks", label: "Talks" },
  { path: "/oss", label: "Open source" },
  { path: "/about", label: "About" },
];

const APPS: Row[] = [
  {
    key: "opie",
    title: "Opie",
    sub: "Your actions, around the cursor.",
    href: "https://opies.io",
    preview: "/previews/opie.webp",
  },
  {
    key: "jolt",
    title: "Jolt",
    sub: "The intelligent launcher for your Mac.",
    href: "https://usejolt.app",
    preview: "/previews/jolt.webp",
  },
  {
    key: "talkify",
    title: "Talkify",
    sub: "Speak. It's written.",
    href: "https://usetalkify.app",
    preview: "/previews/talkify.webp",
  },
  {
    key: "drooop",
    title: "drooop",
    sub: "The missing layer between your Mac and iPhone.",
    href: "https://drooop.app",
    preview: "/previews/drooop.webp",
  },
];

const LINKS: Row[] = [
  { key: "x", title: "X", href: "https://x.com/tornikegomareli" },
  { key: "github", title: "GitHub", href: "https://github.com/tornikegomareli" },
  { key: "linkedin", title: "LinkedIn", href: "https://www.linkedin.com/in/tornikegomareli" },
  { key: "youtube", title: "YouTube", href: "https://www.youtube.com/@Devtherapy" },
];

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
}

function Writing() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");
  if (loading) return <Loading />;
  return (
    <Rows
      rows={writing(data).map((p) => ({
        key: `${p.section}/${p.slug}`,
        title: p.title,
        sub: formatMonthYear(p.date),
        to: `/${p.section}/${p.slug}`,
      }))}
    />
  );
}

function Talks() {
  const { data, loading } = useFetch<PostsBySection>("/api/posts");
  if (loading) return <Loading />;
  return (
    <Rows
      rows={(data?.talks ?? []).map((t) => ({
        key: t.slug,
        title: t.title,
        sub: formatMonthYear(t.date),
        to: `/talks/${t.slug}`,
        preview: t.youtubeId && `https://i.ytimg.com/vi_webp/${t.youtubeId}/maxresdefault.webp`,
      }))}
    />
  );
}

function OpenSource() {
  const { data, loading } = useFetch<Repo[]>("/api/projects");
  if (loading) return <Loading />;
  return (
    <Rows
      rows={(data ?? []).map((r) => ({
        key: r.name,
        title: r.name,
        sub: r.description ?? undefined,
        href: r.html_url,
      }))}
    />
  );
}

function About({ onContact }: { onContact: () => void }) {
  return (
    <>
      <div className="bio rise">
        <p>
          I'm a software engineer and designer with 10+ years of experience building things I care about. These days, I
          build alongside AI agents. I like to call myself an <strong>Applied AI Engineer</strong> because I'm
          fascinated by the idea that AI can amplify my skills tenfold, push the boundaries of what I can create, and
          help me build things that genuinely improve everyday life.
        </p>
        <p>
          I believe AI should help us build better software, not more software. There's already enough slop in the
          world. I care deeply about the craft, the tiny details most people won't notice, the feeling of a product, and
          the thought behind every interaction. I love understanding how things work, challenging what's possible, and
          turning ambitious ideas into something real.
        </p>
        <p>At the end of the day, I just love building. And I love every second of it.</p>
      </div>
      <Rows rows={[{ key: "email", title: "Email", onClick: onContact }, ...LINKS]} />
    </>
  );
}

export default function Home() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [target, setTarget] = useState<string | null>(null);
  const [switched, setSwitched] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef("");
  const leaving = useRef(false);
  const active = target ?? pathname;

  // Every tab then opens without a loading state
  useEffect(() => {
    load("/api/posts").catch(() => {});
    load("/api/projects").catch(() => {});
  }, []);

  const finish = () => {
    leaving.current = false;
    // Skip if the visitor left the page while the tab faded out
    if (!contentRef.current) return;
    setSwitched(true);
    setTarget(null);
    navigate(targetRef.current);
  };

  // The marker moves at once; the old tab blurs out, then the new one blurs in
  const select = (e: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (path === active) return;
    setTarget(path);
    targetRef.current = path;
    if (leaving.current) return;
    const content = contentRef.current;
    if (!content || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    leaving.current = true;
    const fadeOut = { opacity: 0, filter: "blur(6px)" };
    const timing: KeyframeAnimationOptions = { duration: 240, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" };
    // The hovered row's preview lives outside the content, so it fades on its own
    document.querySelector(".previews")?.animate(fadeOut, timing);
    content.animate(fadeOut, timing).finished.then(finish, finish);
  };

  const tab =
    pathname === "/writing" ? (
      <Writing />
    ) : pathname === "/talks" ? (
      <Talks />
    ) : pathname === "/oss" ? (
      <OpenSource />
    ) : pathname === "/about" ? (
      <About onContact={() => setContactOpen(true)} />
    ) : (
      <Rows rows={APPS} />
    );

  return (
    <div className="enter">
      <header className="intro rise">
        <h1>Tornike Gomareli</h1>
        <p>Making software which feels truly crafted</p>
      </header>
      <nav className="tabs rise" style={{ "--i": 1 } as CSSProperties} aria-label="Sections">
        {TABS.map((t) => (
          <Link
            key={t.path}
            to={t.path}
            onClick={(e) => select(e, t.path)}
            aria-current={t.path === active ? "page" : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {/* On the first visit the rows wait for the header to rise; after a tab switch they start at once */}
      <div
        ref={contentRef}
        key={pathname}
        className={switched ? "tab tab-in" : "tab"}
        style={{ "--base": switched ? "0ms" : "160ms" } as CSSProperties}
      >
        {tab}
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
