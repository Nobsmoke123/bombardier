"use client";

import type { TodayQueueResponse } from "@job-tracker/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export function TodayQueue({ queue }: { queue: TodayQueueResponse }) {
  const reduce = useReducedMotion();

  if (queue.remaining === 0) {
    return (
      <p className="text-muted">
        Daily target reached. {queue.appliedToday} applications logged today.
      </p>
    );
  }

  if (queue.items.length === 0) {
    return (
      <p className="text-muted">
        The queue is empty. Import companies or mark existing ones as not
        applied.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-line border-t border-line">
      <AnimatePresence initial={false}>
        {queue.items.map((company, index) => (
          <motion.li
            key={company.id}
            layout={!reduce}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-baseline justify-between gap-4 py-4"
          >
            <div>
              <p>
                <span className="mr-3 text-sm text-muted">{index + 1}</span>
                {company.name}
              </p>
              <p className="mt-1 text-sm text-muted">
                {company.application.role || "Role not set"}
                {company.industry ? ` · ${company.industry}` : ""}
              </p>
            </div>
            <Link
              href={`/companies/${company.id}`}
              className="shrink-0 text-sm underline underline-offset-4 transition-colors duration-150 hover:text-amber"
            >
              Open
            </Link>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}
