export interface Work {
  key: string;
  kind: "app" | "oss";
  name: string;
  line: string;
  href: string;
  // A file name in /media: <media>.mp4 plays over <media>.webp, or <media>.webp alone when still
  media: string;
  // The app icon in /media/icons/<key>.png
  icon?: boolean;
  still?: boolean;
  // Phone recordings stand upright in the card
  portrait?: boolean;
  // Width / height of the media when it is not 16 / 9
  ratio?: string;
  // Wide cards take both columns
  wide?: boolean;
  // The card's surface in light mode
  tint: string;
}

export const WORK: Work[] = [
  {
    key: "drooop",
    kind: "app",
    name: "drooop",
    line: "The missing layer between your Mac and iPhone.",
    href: "https://drooop.app",
    media: "drooop",
    icon: true,
    wide: true,
    tint: "#f3efe9",
  },
  {
    key: "atlas",
    kind: "app",
    name: "Atlas",
    line: "A hidden second desktop for your agent.",
    href: "https://atlas.insanearts.io",
    media: "atlas",
    ratio: "16 / 10",
    icon: true,
    wide: true,
    tint: "#f4ede3",
  },
  {
    key: "opie",
    kind: "app",
    name: "Opie",
    line: "Every command, one flick away.",
    href: "https://opies.io",
    media: "opie",
    icon: true,
    tint: "#e8edf6",
  },
  {
    key: "jolt",
    kind: "app",
    name: "Jolt",
    line: "The Mac launcher that understands plain language.",
    href: "https://usejolt.app",
    media: "jolt",
    icon: true,
    tint: "#e6eef4",
  },
  {
    key: "talkify",
    kind: "oss",
    name: "Talkify",
    line: "Free, local voice dictation for the Mac.",
    href: "https://github.com/tornikegomareli/Talkify",
    media: "talkify",
    ratio: "1326 / 546",
    icon: true,
    wide: true,
    tint: "#ebe8f4",
  },
  {
    key: "scene",
    kind: "oss",
    name: "Scene",
    line: "One theme for your whole Mac.",
    href: "https://github.com/InsaneArts/scene",
    media: "scene",
    icon: true,
    wide: true,
    tint: "#f4ebf0",
  },
  {
    key: "omarchy-spaces",
    kind: "oss",
    name: "Spaces for Omarchy",
    line: "See what runs on every workspace.",
    href: "https://github.com/tornikegomareli/omarchy-spaces",
    media: "omarchy-spaces",
    ratio: "16 / 10",
    still: true,
    tint: "#e7e8eb",
  },
  {
    key: "spacewalk",
    kind: "oss",
    name: "Spacewalk",
    line: "Spaces, without the wait.",
    href: "https://github.com/InsaneArts/Spacewalk",
    media: "spacewalk",
    icon: true,
    tint: "#ebe9f4",
  },
  {
    key: "herdrbar",
    kind: "oss",
    name: "Herdrbar",
    line: "Your agents, in your menu bar.",
    href: "https://github.com/InsaneArts/herdrbar",
    media: "herdrbar",
    icon: true,
    tint: "#e6e9ef",
  },
  {
    key: "aurora",
    kind: "oss",
    name: "Aurora",
    line: "The Apple Intelligence glow for SwiftUI.",
    href: "https://github.com/tornikegomareli/Aurora",
    media: "aurora",
    ratio: "443 / 900",
    portrait: true,
    tint: "#f5e9ef",
  },
];
