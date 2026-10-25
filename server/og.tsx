import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const read = (...path: string[]) => readFileSync(join(process.cwd(), ...path));

// One array for every render, so satori parses the fonts only once
const fonts = [
  { name: "Inter Display", data: read("server/fonts/InterDisplay-SemiBold.ttf"), weight: 600 as const },
  { name: "Inter", data: read("server/fonts/Inter-Regular.ttf"), weight: 400 as const },
  // Inter has no Georgian letters, so Georgian titles fall back to this
  { name: "Noto Sans Georgian", data: read("server/fonts/NotoSansGeorgian-SemiBold.ttf"), weight: 600 as const },
];

const avatar = `data:image/jpeg;base64,${read("public/avatar.jpg").toString("base64")}`;

// The fonts have no emoji
const EMOJI = /\p{Extended_Pictographic}|\p{Emoji_Modifier}|\u200d|\ufe0f/gu;

// The link preview card: the avatar, then the title and a gray line, like the pages
export async function renderCard(title: string, sub: string): Promise<Buffer> {
  // Longer titles get smaller, so they fit before they need clamping
  const size = title.length > 90 ? 44 : title.length > 60 ? 52 : 68;
  const svg = await satori(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 96,
        background: "#fff",
      }}
    >
      <img
        src={avatar}
        width={88}
        height={88}
        style={{ borderRadius: 44, boxShadow: "0 0 0 2px rgb(0 0 0 / 0.08)" }}
        alt=""
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "block",
            lineClamp: 4,
            textWrap: "balance",
            fontFamily: "Inter Display",
            fontWeight: 600,
            fontSize: size,
            lineHeight: 1.1,
            letterSpacing: size * -0.02,
            color: "#09090b",
          }}
        >
          {title.replace(EMOJI, "").trim()}
        </div>
        <div style={{ marginTop: 20, fontFamily: "Inter", fontSize: 32, color: "#71717a" }}>{sub}</div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
  return new Resvg(svg).render().asPng();
}
