import { useState } from "react";
import { useTweaks } from "../hooks/useTheme";

const HUES = [
  { label: "rose", v: 10 },
  { label: "terracotta", v: 45 },
  { label: "forest", v: 145 },
  { label: "ocean", v: 220 },
  { label: "plum", v: 300 },
  { label: "pink", v: 340 },
];

export default function TweaksPanel() {
  const { tweaks, setTweak } = useTweaks();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="tweaks-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Tweaks"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      <div className={`tweaks-panel ${open ? "open" : ""}`}>
        <h4>Tweaks</h4>
        <div className="row">
          <label>mode</label>
          <div className="segment">
            {(["light", "sepia", "dark"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={tweaks.mode === m}
                onClick={() => setTweak("mode", m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>typography</label>
          <div className="segment">
            {(["serif", "sans", "mono"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tweaks.typography === t}
                onClick={() => setTweak("typography", t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>reading width</label>
          <div className="segment">
            {(["narrow", "medium", "wide"] as const).map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={tweaks.readingWidth === w}
                onClick={() => setTweak("readingWidth", w)}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label>accent</label>
          <div className="hue-row">
            {HUES.map((h) => (
              <button
                key={h.v}
                type="button"
                className="hue-swatch"
                aria-pressed={tweaks.accentHue === h.v}
                title={h.label}
                style={{ background: `oklch(0.72 0.14 ${h.v})` }}
                onClick={() => setTweak("accentHue", h.v)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
