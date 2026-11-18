export interface Work {
  key: string;
  kind: "app" | "oss";
  name: string;
  line: string;
  href: string;
  // A file name in /media: <media>.mp4 plays over its poster, <media>.webp
  media: string;
  // Wide cards take both columns
  wide?: boolean;
  // Width / height of a wide card whose video is not 16 / 9
  shape?: string;
}

export const WORK: Work[] = [
  {
    key: "drooop",
    kind: "app",
    name: "drooop",
    line: "The missing layer between your Mac and iPhone.",
    href: "https://drooop.app",
    media: "drooop",
    wide: true,
  },
  {
    key: "atlas",
    kind: "app",
    name: "Atlas",
    line: "A hidden second desktop for your agent.",
    href: "https://atlas.insanearts.io",
    media: "atlas",
    wide: true,
  },
  {
    key: "opie",
    kind: "app",
    name: "Opie",
    line: "Every command, one flick away.",
    href: "https://opies.io",
    media: "opie",
    wide: true,
  },
  {
    key: "jolt",
    kind: "app",
    name: "Jolt",
    line: "The Mac launcher that understands plain language.",
    href: "https://usejolt.app",
    media: "jolt",
    wide: true,
  },
  {
    key: "talkify",
    kind: "oss",
    name: "Talkify",
    line: "Free, local voice dictation for the Mac.",
    href: "https://github.com/tornikegomareli/Talkify",
    media: "talkify",
    wide: true,
    shape: "1326 / 546",
  },
  {
    key: "scene",
    kind: "oss",
    name: "Scene",
    line: "One theme for your whole Mac.",
    href: "https://github.com/InsaneArts/scene",
    media: "scene",
    wide: true,
  },
  {
    key: "omarchy-spaces",
    kind: "oss",
    name: "Spaces for Omarchy",
    line: "See what runs on every workspace.",
    href: "https://github.com/tornikegomareli/omarchy-spaces",
    media: "omarchy-spaces",
    wide: true,
  },
  {
    key: "herdrbar",
    kind: "oss",
    name: "Herdrbar",
    line: "Your agents, in your menu bar.",
    href: "https://github.com/InsaneArts/herdrbar",
    media: "herdrbar",
    wide: true,
  },
  {
    key: "spacewalk",
    kind: "oss",
    name: "Spacewalk",
    line: "Spaces, without the wait.",
    href: "https://github.com/InsaneArts/Spacewalk",
    media: "spacewalk",
  },
  {
    key: "aurora",
    kind: "oss",
    name: "Aurora",
    line: "The Apple Intelligence glow for SwiftUI.",
    href: "https://github.com/tornikegomareli/Aurora",
    media: "aurora",
  },
];
