import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

type AuthShellProps = {
  title: string;
  lede: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, lede, children, footer }: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-6 py-16 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-sm tracking-wide text-amber">
          Bombardier
        </Link>
        <ThemeToggle />
      </div>
      <h1 className="mt-6 font-display text-5xl leading-none tracking-tight text-ink sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{lede}</p>
      <div className="mt-10">{children}</div>
      <p className="mt-8 text-sm text-muted">{footer}</p>
    </main>
  );
}
