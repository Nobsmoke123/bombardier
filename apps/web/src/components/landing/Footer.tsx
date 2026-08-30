export function Footer() {
  return (
    <footer className="border-t border-void-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-lg text-white">Bombardier</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#about" className="hover:text-white">
            Privacy
          </a>
          <a
            href="https://github.com/Nobsmoke123/bombardier"
            className="hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-10 text-xs text-zinc-500 sm:px-8">
        © {new Date().getFullYear()} Bombardier. A personal command center for
        the search.
      </p>
    </footer>
  );
}
