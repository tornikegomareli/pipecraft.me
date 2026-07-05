import { useTweaks } from "../hooks/useTheme";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionGraphProps {
  days: ContributionDay[];
}

// Exact GitHub calendar palette per theme
const LEVEL_COLORS = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ContributionGraph({ days }: ContributionGraphProps) {
  const { tweaks } = useTweaks();
  const colors = tweaks.mode === "dark" ? LEVEL_COLORS.dark : LEVEL_COLORS.light;

  if (!days.length) return null;

  const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: (ContributionDay | null)[] = [...Array(firstDow).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  let lastMonth = -1;
  const monthLabels = weeks.map((week) => {
    const firstDay = week.find(Boolean);
    const m = firstDay ? new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth() : lastMonth;
    const label = m !== lastMonth ? MONTH_NAMES[m] : "";
    lastMonth = m;
    return label;
  });

  return (
    <div className="contrib-card">
      <div className="contrib-grid">
        <div className="contrib-months">
          {monthLabels.map((label, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: weeks are positionally stable
            <div key={i}>{label}</div>
          ))}
        </div>
        <div className="contrib-weeks">
          {weeks.map((week, wi) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: weeks are positionally stable
            <div className="contrib-week" key={wi}>
              {week.map((day, di) =>
                day ? (
                  <div
                    key={day.date}
                    className="contrib-cell"
                    style={{ background: colors[day.level] }}
                    title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                  />
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: padding cells have no date
                  <div key={di} className="contrib-cell" style={{ background: "transparent" }} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
