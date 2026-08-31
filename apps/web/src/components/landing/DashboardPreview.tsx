const SAMPLE = [
  { name: "Jane Street", role: "Backend Engineer", industry: "Markets" },
  { name: "Cloudflare", role: "Platform Engineer", industry: "Infrastructure" },
  { name: "Linear", role: "Fullstack Engineer", industry: "Software" },
] as const;

export function DashboardPreview() {
  return (
    <section id="queue" className="scroll-mt-24 bg-paper py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-[13px] text-muted">Preview · sample data</p>
        <h2 className="mt-3 font-display text-5xl tracking-tight text-ink">Today.</h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
          The signed-in dashboard uses this layout. The companies below are
          sample rows so you can see the list before you import your own.
        </p>

        <div className="mt-14 max-w-3xl border-t border-line pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Daily target</p>
              <p className="mt-2 font-display text-4xl tracking-tight text-ink">2 of 5</p>
            </div>
            <p className="text-sm text-muted">3 remaining on this sample day</p>
          </div>

          <ol className="mt-10 divide-y divide-line border-t border-line">
            {SAMPLE.map((company, index) => (
              <li key={company.name} className="flex items-baseline justify-between gap-4 py-4">
                <div>
                  <p>
                    <span className="mr-3 text-sm text-muted">{index + 1}</span>
                    {company.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {company.role} · {company.industry}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-muted">Open</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
