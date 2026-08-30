import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-6 py-16 sm:px-8">
      <p className="font-display text-sm tracking-wide text-amber">Job Tracker</p>
      <h1 className="mt-6 font-display text-5xl leading-none tracking-tight">
        Page not found.
      </h1>
      <p className="mt-5 max-w-md text-muted">
        That route is not part of the tracker. Head back to today&apos;s queue.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 w-fit underline underline-offset-4 hover:text-amber"
      >
        Back to the dashboard
      </Link>
    </main>
  );
}
