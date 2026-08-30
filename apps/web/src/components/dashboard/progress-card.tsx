export function ProgressCard({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const safeMax = Math.max(max, 1);
  const ratio = Math.min(1, value / safeMax);

  return (
    <article className="border-t border-line pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <p className="text-sm text-ink">
          {value} / {max}
        </p>
      </div>
      <div
        className="mt-4 h-2 bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      >
        <div className="h-full bg-amber" style={{ width: `${ratio * 100}%` }} />
      </div>
    </article>
  );
}
