"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HeroReveal } from "./fade-up";
import { GLOBE_ROLES } from "./globe-roles";

const Earth = dynamic(
  () => import("./Earth").then((mod) => mod.Earth),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto aspect-square w-full max-w-[36rem] lg:max-w-none"
        aria-hidden="true"
      />
    ),
  },
);

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-visible">
      <div className="mx-auto grid min-h-[calc(100dvh-3.5rem)] max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.15fr)] lg:gap-4">
        <div className="max-w-xl">
          <HeroReveal>
            <p className="text-[13px] font-medium tracking-wide text-muted">
              Personal job search. One queue.
            </p>
          </HeroReveal>
          <HeroReveal delay={0.06}>
            <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-8xl">
              Bombardier
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.12}>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-muted sm:text-xl">
              Import companies from a CSV. Log which resume you sent. Today’s
              list is only as long as the number you set.
            </p>
          </HeroReveal>
          <HeroReveal delay={0.18} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="bg-ink px-5 py-2.5 text-sm text-paper transition-opacity duration-150 hover:opacity-80"
            >
              Create an account
            </Link>
            <a
              href="#queue"
              className="border border-line px-5 py-2.5 text-sm text-ink transition-colors duration-150 hover:border-ink"
            >
              See today’s queue
            </a>
          </HeroReveal>
        </div>

        <motion.div
          className="relative overflow-visible"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Interactive globe of applications across continents"
        >
          <Earth />
          <p className="sr-only">
            Drag to rotate the globe. Continents are shown as glowing points.
            Ten roles travel on orbital paths: {GLOBE_ROLES.join(", ")}. Zoom is
            disabled.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
