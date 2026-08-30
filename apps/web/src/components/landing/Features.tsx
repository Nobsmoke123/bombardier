import { FadeUp } from "./fade-up";

const FEATURES = [
  {
    title: "CSV Deduplication",
    body: "Normalize names, drop in-file repeats, and skip companies you already track.",
  },
  {
    title: "Resume Performance Analytics",
    body: "See which version earns interviews and offers — not just downloads.",
  },
  {
    title: "LinkedIn Outreach Tracking",
    body: "Log every contact, connection state, and conversation without another spreadsheet.",
  },
  {
    title: "Interview Pipeline",
    body: "Move roles from applied to HR, technical, final, and offer in one status line.",
  },
  {
    title: "Daily Application Targets",
    body: "Today’s queue is sized to the number you actually intend to send.",
  },
  {
    title: "Global Company Database",
    body: "Search, filter, and open any company you imported — one record, one application.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeUp>
          <p className="text-sm text-amber">Features</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
            The operating system for a deliberate search.
          </h2>
        </FadeUp>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FadeUp key={feature.title} delay={index * 0.04}>
              <article className="h-full border border-line bg-surface p-6 transition-transform duration-150 hover:-translate-y-1">
                <h3 className="font-display text-xl text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{feature.body}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
