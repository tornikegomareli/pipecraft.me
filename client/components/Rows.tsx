import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export interface Row {
  key: string;
  title: string;
  sub?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  // Image shown beside the list while the row is hovered (wide screens with a mouse only)
  preview?: string;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
// Small near the middle, larger toward the edges
const edge = (v: number) => Math.sign(v) * (1 - Math.sqrt(1 - Math.abs(v)));

// A list of two-line rows. With a mouse, a glass pill slides to the hovered row and tilts
// toward the pointer, and the row's preview image blurs in beside the list.
export default function Rows({ rows }: { rows: Row[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const glassRef = useRef<HTMLSpanElement>(null);
  const box = useRef<Box | null>(null);
  const hideTimer = useRef(0);
  const [active, setActive] = useState<number | null>(null);
  const [armed, setArmed] = useState(false);
  const [previewTop, setPreviewTop] = useState(0);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const enter = (e: PointerEvent<HTMLElement>, index: number) => {
    const pill = pillRef.current;
    if (e.pointerType !== "mouse" || !pill) return;
    clearTimeout(hideTimer.current);
    const row = e.currentTarget;
    box.current = { left: row.offsetLeft, top: row.offsetTop, width: row.offsetWidth, height: row.offsetHeight };

    // The pill fades in where it first appears, then slides from row to row
    const hidden = !pill.classList.contains("on");
    if (hidden) pill.style.transition = "none";
    pill.style.transform = `translate(${row.offsetLeft}px, ${row.offsetTop}px)`;
    pill.style.width = `${row.offsetWidth}px`;
    pill.style.height = `${row.offsetHeight}px`;
    if (hidden) {
      pill.getBoundingClientRect();
      pill.style.transition = "";
      pill.classList.add("on");
    }

    const first = listRef.current?.querySelector(".row")?.getBoundingClientRect().top ?? 0;
    setPreviewTop(Math.max(first, (window.innerHeight - 225) / 2));
    setActive(index);
  };

  // A short delay keeps the pill up while the pointer crosses the gap between rows
  const leave = () => {
    clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      pillRef.current?.classList.remove("on");
      setActive(null);
    }, 500);
  };

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const b = box.current;
    const glass = glassRef.current;
    if (e.pointerType !== "mouse" || !b || !glass) return;
    const list = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - list.left;
    const y = e.clientY - list.top;
    const h = clamp((x - b.left - b.width / 2) / (b.width / 2), -1, 1);
    const v = clamp((y - b.top - b.height / 2) / (b.height / 2), -1, 1);
    const shiftX = 12 * edge(h);
    const shiftY = 8 * edge(v);
    glass.style.transformOrigin = `${30 + 40 * clamp((x - b.left) / b.width, 0, 1)}% ${30 + 40 * clamp((y - b.top) / b.height, 0, 1)}%`;
    glass.style.transform = `translate(${shiftX}px, ${shiftY}px) rotateX(${-v * Math.min(1.6, 0.7 + (0.18 * b.width) / b.height)}deg) rotateY(${0.8 * h}deg)`;
    // The text follows the pill a little, so the two read as layers
    e.currentTarget.style.setProperty("--shift-x", `${shiftX * 0.18}px`);
    e.currentTarget.style.setProperty("--shift-y", `${shiftY * 0.18}px`);
  };

  const flatten = (e: PointerEvent<HTMLDivElement>) => {
    glassRef.current?.style.removeProperty("transform");
    e.currentTarget.style.removeProperty("--shift-x");
    e.currentTarget.style.removeProperty("--shift-y");
  };

  const previews = rows.some((r) => r.preview);

  return (
    <div
      ref={listRef}
      className="rows"
      onPointerEnter={(e) => e.pointerType === "mouse" && setArmed(true)}
      onPointerMove={tilt}
      onPointerLeave={flatten}
    >
      <span ref={pillRef} className="pill" aria-hidden="true">
        <span ref={glassRef} className="glass" />
      </span>
      <ul>
        {rows.map((r, i) => {
          const props = {
            className: active === i ? "row on" : "row",
            style: { "--i": Math.min(i, 12) } as CSSProperties,
            onPointerEnter: (e: PointerEvent<HTMLElement>) => enter(e, i),
            onPointerLeave: leave,
          };
          const text = (
            <span className="row-text">
              <span className="row-title">{r.title}</span>
              {r.sub && <span className="row-sub">{r.sub}</span>}
            </span>
          );
          return (
            <li key={r.key}>
              {r.to ? (
                <Link to={r.to} {...props}>
                  {text}
                </Link>
              ) : r.href ? (
                <a href={r.href} target="_blank" rel="noreferrer" {...props}>
                  {text}
                </a>
              ) : (
                <button type="button" onClick={r.onClick} {...props}>
                  {text}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {armed &&
        previews &&
        createPortal(
          <div className="previews" style={{ top: previewTop }} aria-hidden="true">
            {rows.map(
              (r, i) =>
                r.preview && <img key={r.key} src={r.preview} alt="" className={active === i ? "on" : undefined} />,
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
