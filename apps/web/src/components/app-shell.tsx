"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { logoutRequest } from "@/lib/auth";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/resumes", label: "Resumes" },
];

export function AppShell({
  title,
  lede,
  action,
  children,
}: {
  title: string;
  lede?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function onLogout() {
    await logoutRequest();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 py-10 sm:px-8">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
        <Link href="/dashboard" className="font-display text-sm tracking-wide text-amber">
          Job Tracker
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-5 text-sm">
          {LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-ink underline decoration-amber underline-offset-4"
                    : "text-muted hover:text-ink"
                }
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={onLogout}
            className="text-muted underline underline-offset-4 hover:text-ink"
          >
            Sign out
          </button>
        </nav>
      </header>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-5xl leading-none tracking-tight">{title}</h1>
          {lede ? <p className="mt-4 max-w-xl text-muted">{lede}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-10 flex-1">{children}</div>
    </div>
  );
}
