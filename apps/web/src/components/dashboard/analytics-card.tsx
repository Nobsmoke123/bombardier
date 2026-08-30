import type { ReactNode } from "react";

export function AnalyticsCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="text-sm text-muted">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
