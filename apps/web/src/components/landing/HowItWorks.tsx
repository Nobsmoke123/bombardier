const STEPS = [
  {
    n: "1",
    title: "Drop in the CSV you already have.",
    body: "Company names are normalized. Rows that repeat in the file, and companies you already track, are skipped.",
  },
  {
    n: "2",
    title: "Work the queue, not a spreadsheet.",
    body: "You set a daily number. The list is that long. Open a company, send the application, it leaves the list.",
  },
  {
    n: "3",
    title: "Compare resume versions from the log.",
    body: "Each application points at the file you sent. Interview rate is counted from that record, not from memory.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="bg-paper py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="max-w-xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
          How a day runs.
        </h2>
        <ol className="mt-16 max-w-2xl">
          {STEPS.map((step) => (
            <li key={step.n} className="border-t border-line py-10">
              <p className="text-[13px] text-muted">{step.n}</p>
              <h3 className="mt-3 font-display text-2xl tracking-tight text-ink">{step.title}</h3>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
