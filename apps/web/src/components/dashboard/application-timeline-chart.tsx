import type { TimelinePoint } from "@job-tracker/types";

export function ApplicationTimelineChart({ points }: { points: TimelinePoint[] }) {
  const max = Math.max(...points.map((point) => point.applied), 1);
  const first = points[0]?.date;
  const last = points[points.length - 1]?.date;

  return (
    <div>
      <div
        className="grid h-40 items-end gap-1"
        style={{ gridTemplateColumns: `repeat(${Math.max(points.length, 1)}, minmax(0, 1fr))` }}
        role="img"
        aria-label="Applications over the last 14 days"
      >
        {points.map((point) => {
          const empty = point.applied === 0;
          return (
            <div key={point.date} className="flex h-full flex-col justify-end">
              <div
                className={empty ? "bg-line" : "bg-ink"}
                style={{
                  height: empty ? 2 : `${Math.max(8, (point.applied / max) * 100)}%`,
                }}
                title={`${point.date}: ${point.applied} applied`}
              />
            </div>
          );
        })}
      </div>
      {first && last ? (
        <div className="mt-3 flex justify-between text-xs text-muted">
          <span>{formatShortDate(first)}</span>
          <span>{formatShortDate(last)}</span>
        </div>
      ) : null}
    </div>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
