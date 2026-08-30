"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { FadeUp } from "./fade-up";

export function CTA() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-void-line py-28">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(249,115,22,0.16), transparent 70%)",
        }}
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.45, 0.8, 0.45],
                scale: [1, 1.06, 1],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <FadeUp className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="font-display text-4xl tracking-tight text-white sm:text-6xl">
          Ready to land your next opportunity?
        </h2>
        <p className="mx-auto mt-5 max-w-[42ch] text-base text-zinc-400">
          Create a free account, import the companies you already have, and let
          today’s queue tell you what to send next.
        </p>
        <Link
          href="/register"
          className="mt-10 inline-flex bg-signal px-8 py-4 text-base text-void transition-opacity duration-150 hover:opacity-90"
        >
          Create your free account
        </Link>
      </FadeUp>
    </section>
  );
}
