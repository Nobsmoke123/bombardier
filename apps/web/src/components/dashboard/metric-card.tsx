export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <article className="border-t border-line pt-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </article>
  );
}
