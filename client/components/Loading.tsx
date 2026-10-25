const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

// Fades in only when loading takes long enough to notice.
export default function Loading() {
  return (
    <output className="loading" aria-label="Loading">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {PETALS.map((deg) => (
          <rect
            key={deg}
            x="11"
            y="2"
            width="2"
            height="6"
            rx="1"
            opacity={0.25 + (deg / 315) * 0.75}
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </svg>
    </output>
  );
}
