"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FadeUp } from "./fade-up";

const ITEMS = [
  "Track every resume",
  "Measure interview conversion",
  "Organize LinkedIn outreach",
  "Never apply twice",
  "Hit your daily target consistently",
] as const;

export function WhyBombardier() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="scroll-mt-24 border-t border-line py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <FadeUp>
          <p className="text-sm text-amber">Why Bombardier</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Stop guessing. Start measuring.
          </h2>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted">
            A successful search is an optimization problem, not a numbers game.
            Volume without signal wastes months. Bombardier tells you which
            resume, which message, and which companies actually move — so the
            next day of outreach is chosen, not hoped for.
          </p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <ul className="grid gap-4 border-t border-line pt-2">
            {ITEMS.map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-4 border-b border-line py-4 text-ink"
              >
                <motion.span
                  className="flex h-6 w-6 items-center justify-center border border-amber text-amber"
                  initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <path
                      d="M3 8.2 6.2 11.5 13 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </motion.span>
                {item}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
