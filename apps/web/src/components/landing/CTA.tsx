import Link from "next/link";

export function CTA() {
  return (
    <section className="border-t border-line bg-paper py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Create an account.
        </h2>
        <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-muted">
          The queue is empty until you import companies. That is the first
          screen after sign-in.
        </p>
        <Link
          href="/register"
          className="mt-10 inline-flex bg-ink px-5 py-2.5 text-sm text-paper transition-opacity duration-150 hover:opacity-80"
        >
          Get started
        </Link>
      </div>
    </section>
  );
}
