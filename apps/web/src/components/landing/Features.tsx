const REST = [
  {
    title: "CSV import",
    body: "Unlimited files. In-file repeats and companies you already have are dropped.",
  },
  {
    title: "Resume versions",
    body: "Each application is tied to the file you sent, so interview rate is per version.",
  },
  {
    title: "LinkedIn log",
    body: "Contact, connection state, and the last note sit on the company record.",
  },
  {
    title: "Status line",
    body: "Applied, HR, technical, final, offer — one field, not a second board.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-surface py-28">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-24">
        <div>
          <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Today’s queue is the product.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-muted">
            You set how many applications you intend to send. The list is cut to
            that length. When you mark one applied, the next company takes its
            place.
          </p>
        </div>
        <ul>
          {REST.map((item) => (
            <li key={item.title} className="border-t border-line py-6">
              <h3 className="text-sm text-ink">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
