import { FadeUp } from "./fade-up";

const STATUSES = [
  { label: "Applied", tone: "text-zinc-200 border-void-line" },
  { label: "HR stage", tone: "text-signal border-signal/40" },
  { label: "Technical", tone: "text-zinc-200 border-void-line" },
  { label: "Rejected", tone: "text-zinc-500 border-void-line" },
] as const;

const FUNNEL = [
  { label: "Applied", width: "100%" },
  { label: "HR", width: "42%" },
  { label: "Technical", width: "24%" },
  { label: "Offer", width: "9%" },
] as const;

const LINE = "M8 72 C 40 68, 56 40, 88 44 S 140 20, 176 28 220 54, 248 36";

export function DashboardPreview() {
  return (
    <section id="analytics" className="scroll-mt-24 border-t border-void-line py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeUp>
          <p className="text-sm text-signal">Analytics</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl">
            A dashboard that reads like a briefing.
          </h2>
        </FadeUp>

        <FadeUp delay={0.08} className="mt-12 border border-void-line bg-void-surface p-5 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div>
              <p className="text-sm text-zinc-400">Applications · last 14 days</p>
              <svg viewBox="0 0 256 88" className="mt-6 h-40 w-full" role="img" aria-label="Mock line chart of applications">
                <path d="M8 80h240" stroke="#27272A" strokeWidth="1" />
                <path d={LINE} fill="none" stroke="#F97316" strokeWidth="2" />
                <circle cx="248" cy="36" r="3" fill="#F97316" />
              </svg>
              <div className="mt-6 flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <span
                    key={status.label}
                    className={`border px-2.5 py-1 text-xs ${status.tone}`}
                  >
                    {status.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <article className="border border-void-line p-5">
                <p className="text-sm text-zinc-400">Resume success</p>
                <p className="mt-3 font-display text-2xl text-white">Backend — Spring</p>
                <p className="mt-2 text-sm text-zinc-400">
                  41 applied · 6 interviews · 1 offer
                </p>
                <div className="mt-4 h-1.5 bg-void">
                  <div className="h-full w-2/3 bg-signal" />
                </div>
              </article>
              <article className="border border-void-line p-5">
                <p className="text-sm text-zinc-400">Interview funnel</p>
                <ul className="mt-4 grid gap-3">
                  {FUNNEL.map((row) => (
                    <li key={row.label} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 text-sm">
                      <span className="text-zinc-400">{row.label}</span>
                      <div className="h-2 bg-void">
                        <div className="h-full bg-white/80" style={{ width: row.width }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
