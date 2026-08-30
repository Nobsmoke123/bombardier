"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#analytics", label: "Analytics" },
  { href: "#about", label: "About" },
] as const;

function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="11" cy="11" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.2 11h17.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16.2" cy="7.2" r="1.6" fill="#F97316" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-void-line/80 bg-void/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-sm tracking-wide text-white">
          <span className="text-zinc-200">
            <LogoMark />
          </span>
          <span className="font-display text-lg">Bombardier</span>
        </Link>

        <nav aria-label="Landing" className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors duration-150 hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm text-zinc-400 transition-colors duration-150 hover:text-white">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-signal px-4 py-2 text-sm text-void transition-opacity duration-150 hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="text-sm text-zinc-300 underline underline-offset-4 md:hidden"
          aria-expanded={open}
          aria-controls="landing-mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="landing-mobile-nav"
          aria-label="Landing mobile"
          className="grid gap-3 border-t border-void-line px-5 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-300"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/login" className="text-sm text-zinc-300">
            Login
          </Link>
          <Link href="/register" className="bg-signal px-4 py-2.5 text-center text-sm text-void">
            Get Started
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
