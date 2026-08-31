export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-lg tracking-tight text-ink">Bombardier</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-[13px] text-muted">
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="/privacy" className="hover:text-ink">
            Privacy
          </a>
          <a
            href="https://github.com/Nobsmoke123/bombardier"
            className="hover:text-ink"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-10 text-xs text-muted sm:px-8">
        © {new Date().getFullYear()} Bombardier. A personal job-search tracker.
      </p>
    </footer>
  );
}
