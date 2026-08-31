"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#queue", label: "Queue" },
  { href: "#about", label: "About" },
] as const;

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="11" cy="11" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.2 11h17.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16.2" cy="7.2" r="1.6" fill="var(--amber)" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-4 px-5 sm:h-14 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-sm text-ink">
          <span className="text-ink">
            <LogoMark />
          </span>
          <span className="font-display text-lg tracking-tight">Bombardier</span>
        </Link>

        <nav aria-label="Landing" className="hidden items-center gap-8 text-[13px] text-ink/70 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors duration-150 hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login" className="text-[13px] text-ink/70 transition-colors duration-150 hover:text-ink">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-ink px-4 py-1.5 text-[13px] text-paper transition-opacity duration-150 hover:opacity-80"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-sm text-muted underline underline-offset-4"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="landing-mobile-nav"
          aria-label="Landing mobile"
          className="grid gap-3 border-t border-line px-5 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/login" className="text-sm text-ink">
            Login
          </Link>
          <Link href="/register" className="bg-ink px-4 py-2.5 text-center text-sm text-paper">
            Get Started
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
