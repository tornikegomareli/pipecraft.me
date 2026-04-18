import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Mode = "light" | "sepia" | "dark";
type Typography = "serif" | "sans" | "mono";
type Width = "narrow" | "medium" | "wide";

export interface Tweaks {
  mode: Mode;
  typography: Typography;
  readingWidth: Width;
  accentHue: number;
}

interface TweaksContextValue {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
}

const DEFAULTS: Tweaks = {
  mode: "dark",
  typography: "mono",
  readingWidth: "wide",
  accentHue: 340,
};

const TweaksContext = createContext<TweaksContextValue>({
  tweaks: DEFAULTS,
  setTweak: () => {},
});

function loadTweaks(): Tweaks {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem("tweaks");
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(loadTweaks);

  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-mode", tweaks.mode);
    r.setAttribute("data-typography", tweaks.typography);
    r.setAttribute("data-width", tweaks.readingWidth);
    r.style.setProperty("--accent-h", String(tweaks.accentHue));

    const isDark = tweaks.mode === "dark";
    const lightSheet = document.getElementById("hljs-light") as HTMLLinkElement | null;
    const darkSheet = document.getElementById("hljs-dark") as HTMLLinkElement | null;
    if (lightSheet) lightSheet.disabled = isDark;
    if (darkSheet) darkSheet.disabled = !isDark;

    try {
      localStorage.setItem("tweaks", JSON.stringify(tweaks));
    } catch {}
  }, [tweaks]);

  const setTweak = useCallback<TweaksContextValue["setTweak"]>((k, v) => {
    setTweaks((prev) => ({ ...prev, [k]: v }));
  }, []);

  return (
    <TweaksContext.Provider value={{ tweaks, setTweak }}>
      {children}
    </TweaksContext.Provider>
  );
}

export function useTweaks() {
  return useContext(TweaksContext);
}
