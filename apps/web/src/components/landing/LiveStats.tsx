"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FadeUp } from "./fade-up";

const STATS = [
  { label: "Applications Sent", value: 184, suffix: "" },
  { label: "Companies Tracked", value: 179, suffix: "" },
  { label: "Interview Rate", value: 8.7, suffix: "%", decimals: 1 },
] as const;

function formatValue(value: number, decimals = 0, suffix = "") {
  return `${value.toFixed(decimals)}${suffix}`;
}

function CountUp({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setStarted(true);
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduce) return;

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const eased = 1 - (1 - t) ** 3;
      setShown(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, reduce]);

  return (
    <p ref={ref} className="mt-4 font-display text-5xl tracking-tight text-ink">
      {formatValue(reduce ? value : shown, decimals, suffix)}
    </p>
  );
}

export function LiveStats() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-px bg-line px-0 sm:grid-cols-3">
        {STATS.map((stat, index) => (
          <FadeUp key={stat.label} delay={index * 0.05} className="bg-paper px-5 py-10 sm:px-8">
            <p className="text-sm text-muted">{stat.label}</p>
            <CountUp
              value={stat.value}
              decimals={"decimals" in stat ? stat.decimals : 0}
              suffix={stat.suffix}
            />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
