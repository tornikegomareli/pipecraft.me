import { type PointerEvent, type ReactNode, useRef } from "react";

// A link in running text with the app's icon. With a mouse, its demo plays in a card beside it.
interface Props {
  href: string;
  icon: string;
  // A black logo, drawn white in dark mode
  mono?: boolean;
  media?: string;
  children: ReactNode;
}

export default function Peek({ href, icon, mono, media, children }: Props) {
  const video = useRef<HTMLVideoElement>(null);

  const enter = (e: PointerEvent) => {
    if (e.pointerType === "mouse") video.current?.play().catch(() => {});
  };

  return (
    <span className="peek">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onPointerEnter={enter}
        onPointerLeave={() => video.current?.pause()}
      >
        <img className={mono ? "peek-icon mono" : "peek-icon"} src={icon} alt="" />
        {children}
      </a>
      {media && (
        <span className="peek-card" aria-hidden="true">
          <video
            ref={video}
            src={`/media/${media}.mp4`}
            poster={`/media/${media}.webp`}
            muted
            loop
            playsInline
            preload="none"
          />
        </span>
      )}
    </span>
  );
}
