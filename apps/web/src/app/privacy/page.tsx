import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 py-16 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-sm tracking-wide text-amber">
          Bombardier
        </Link>
        <ThemeToggle />
      </div>
      <h1 className="mt-10 font-display text-5xl leading-none tracking-tight text-ink">
        Privacy.
      </h1>
      <div className="mt-8 grid gap-6 text-[15px] leading-relaxed text-muted">
        <p>
          Bombardier is a personal tracker. An account stores your email, the
          companies and applications you log, LinkedIn outreach notes, and
          references to resume files you upload.
        </p>
        <p>
          Resume bytes go to object storage through a short-lived upload URL.
          The API does not receive the file. Sign-in uses an HTTP-only cookie on
          this origin.
        </p>
        <p>
          There is no recruiting marketplace and no public profile. Data stays
          on the instance you signed up on. Delete the account records there if
          you want them gone.
        </p>
      </div>
      <Link href="/" className="mt-10 w-fit text-sm text-ink underline underline-offset-4">
        Back to the homepage
      </Link>
    </main>
  );
}
