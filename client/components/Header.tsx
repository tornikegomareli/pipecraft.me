import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV = [
  { id: "home", label: "home", path: "/" },
  { id: "essays", label: "essays", path: "/essays" },
  { id: "blog", label: "blog", path: "/posts" },
  { id: "talks", label: "talks", path: "/talks" },
  { id: "projects", label: "projects", path: "/projects" },
  { id: "about", label: "about", path: "/about" },
] as const;

function activeId(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/essays")) return "essays";
  if (pathname.startsWith("/posts")) return "blog";
  if (pathname.startsWith("/talks")) return "talks";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/about")) return "about";
  return "home";
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const active = activeId(location.pathname);

  return (
    <div className="topnav">
      <Link to="/" className="brand">
        tornike<span className="slash">/</span>gomareli
      </Link>
      <nav>
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            aria-current={active === n.id ? "true" : undefined}
            onClick={() => navigate(n.path)}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
