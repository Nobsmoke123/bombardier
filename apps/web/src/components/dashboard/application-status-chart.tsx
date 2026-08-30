import { APPLICATION_STATUSES } from "@job-tracker/types";
import { STATUS_LABELS } from "@/lib/application-labels";

export function ApplicationStatusChart({
  breakdown,
}: {
  breakdown: Record<string, number>;
}) {
  const max = Math.max(...APPLICATION_STATUSES.map((status) => breakdown[status] ?? 0), 1);

  return (
    <ul className="grid gap-3">
      {APPLICATION_STATUSES.map((status) => {
        const count = breakdown[status] ?? 0;
        return (
          <li key={status} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="text-muted">{STATUS_LABELS[status]}</span>
            <div className="h-2 bg-line">
              <div
                className="h-full bg-ink"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-right">{count}</span>
          </li>
        );
      })}
    </ul>
  );
}
