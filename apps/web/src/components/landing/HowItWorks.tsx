import { FadeUp } from "./fade-up";

const STEPS = [
  {
    title: "Import Companies",
    body: "Upload unlimited CSV files. Bombardier automatically removes duplicates.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect x="6" y="4" width="20" height="24" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 12h12M10 16h12M10 20h7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Launch Applications",
    body: "Track resumes, cover letters, outreach, and every company you apply to.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path d="M6 16h20M18 8l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Optimize Strategy",
    body: "Discover which resumes and outreach messages generate interviews.",
    icon: (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <path d="M6 24V12M14 24V8M22 24v-7M6 24h20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
] as const;

export function HowItWorks() {
  return (
    <section className="border-t border-void-line py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeUp>
          <p className="text-sm text-signal">How it works</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl">
            Three moves. Then the data talks.
          </h2>
        </FadeUp>
        <ol className="mt-14 grid gap-10 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              {index < STEPS.length - 1 ? (
                <div
                  className="pointer-events-none absolute top-5 left-14 hidden h-px w-[calc(100%-1rem)] bg-void-line lg:block"
                  aria-hidden="true"
                />
              ) : null}
              <FadeUp delay={index * 0.06} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-signal">{step.icon}</span>
                  <span className="text-sm text-zinc-500">0{index + 1}</span>
                </div>
                <h3 className="font-display text-2xl text-white">{step.title}</h3>
                <p className="max-w-[36ch] text-sm leading-relaxed text-zinc-400">{step.body}</p>
              </FadeUp>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
