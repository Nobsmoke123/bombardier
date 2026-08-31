const SURFACES = ["Today’s queue", "Resume versions", "Company list", "LinkedIn log"] as const;

export function LiveStats() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-10 gap-y-3 px-5 py-7 sm:px-8">
        <p className="text-[13px] text-muted">In the product</p>
        {SURFACES.map((label) => (
          <p key={label} className="text-sm text-ink">
            {label}
          </p>
        ))}
      </div>
    </section>
  );
}
