import { Link, useLocation } from "react-router-dom";

const NAV = [
  { id: "writing", label: "Writing", path: "/writing" },
  { id: "talks", label: "Talks", path: "/talks" },
  { id: "oss", label: "Open source", path: "/oss" },
] as const;

function activeId(pathname: string): string | null {
  if (pathname.startsWith("/writing") || pathname.startsWith("/essays") || pathname.startsWith("/posts")) {
    return "writing";
  }
  if (pathname.startsWith("/talks")) return "talks";
  if (pathname.startsWith("/oss")) return "oss";
  return null;
}

export default function Header() {
  const { pathname } = useLocation();
  const active = activeId(pathname);

  return (
    <header className="topnav">
      {pathname !== "/" && (
        <Link to="/" className="brand">
          <img src="/avatar.jpg" alt="" />
          <span>Tornike Gomareli</span>
        </Link>
      )}
      <nav>
        {NAV.map((n) => (
          <Link key={n.id} to={n.path} aria-current={active === n.id ? "page" : undefined}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
