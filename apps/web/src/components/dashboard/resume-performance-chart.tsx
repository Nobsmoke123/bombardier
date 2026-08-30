import type { ResumePerformance } from "@job-tracker/types";

export function ResumePerformanceChart({
  rows,
}: {
  rows: ResumePerformance[];
}) {
  if (rows.length === 0) {
    return (
      <p className="text-muted">
        Attach resumes to applications and these bars will show which version
        gets interviews.
      </p>
    );
  }

  const max = Math.max(...rows.map((row) => row.applied), 1);

  return (
    <ul className="grid gap-5">
      {rows.map((row) => (
        <li key={row.resumeId}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span>{row.title}</span>
            <span className="text-muted">
              {row.applied} applied · {row.interviews} interviews · {row.offers}{" "}
              offers
            </span>
          </div>
          <div className="mt-2 h-2 bg-line">
            <div
              className="h-full bg-forest"
              style={{ width: `${(row.applied / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
