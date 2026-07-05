import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { useTweaks } from "../hooks/useTheme";

const TBILISI: [number, number] = [44.8015, 41.7151];

const STYLE_URL: Record<"light" | "dark", string> = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

export default function HeroMap() {
  const { tweaks } = useTweaks();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const styleKeyRef = useRef<"light" | "dark">(tweaks.mode === "dark" ? "dark" : "light");

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL[styleKeyRef.current],
      center: TBILISI,
      zoom: 3,
      interactive: false,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      map.flyTo({ center: TBILISI, zoom: 10.5, duration: 5000, essential: true, curve: 1.3 });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const nextKey = tweaks.mode === "dark" ? "dark" : "light";
    if (nextKey === styleKeyRef.current) return;
    styleKeyRef.current = nextKey;
    mapRef.current?.setStyle(STYLE_URL[nextKey]);
  }, [tweaks.mode]);

  return <div className="hero-map" ref={containerRef} />;
}
