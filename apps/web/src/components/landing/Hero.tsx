"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HeroReveal } from "./fade-up";

const Earth = dynamic(
  () => import("./Earth").then((mod) => mod.Earth),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[22rem] w-full bg-surface sm:h-[28rem] lg:h-[min(36rem,72vh)]"
        aria-hidden="true"
      />
    ),
  },
);

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
        <div className="max-w-xl">
          <HeroReveal>
            <p className="inline-flex border border-line bg-surface px-3 py-1 text-xs tracking-wide text-amber">
              Strategic Job Application Command Center
            </p>
          </HeroReveal>
          <HeroReveal delay={0.06}>
            <h1 className="mt-6 font-display text-6xl leading-none tracking-tight text-ink sm:text-7xl lg:text-8xl">
              Bombardier
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.12}>
            <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-muted sm:text-lg">
              Track every application, measure what works, and systematically
              manage your global job search from one intelligent dashboard.
            </p>
          </HeroReveal>
          <HeroReveal delay={0.18} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="bg-amber px-5 py-3 text-sm text-paper transition-opacity duration-150 hover:opacity-90"
            >
              Get Started
            </Link>
            <a
              href="#analytics"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors duration-150 hover:border-ink"
            >
              View Demo
            </a>
          </HeroReveal>
        </div>

        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Interactive globe of applications across continents"
        >
          <Earth />
          <p className="sr-only">
            Drag to rotate the globe. Continents are shown as glowing orange
            points. Zoom is disabled.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
