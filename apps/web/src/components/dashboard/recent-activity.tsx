import type { ActivityItem } from "@job-tracker/types";
import Link from "next/link";
import { formatDate } from "@/lib/resume-labels";

const TYPE_LABEL = {
  application: "Application",
  import: "Import",
  resume: "Resume",
} as const;

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-muted">
        Activity will show here after you apply, import a CSV, or upload a
        resume.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-line border-t border-line">
      {items.map((item) => (
        <li key={item.id} className="py-4">
          <p className="text-sm text-muted">{TYPE_LABEL[item.type]}</p>
          <Link href={item.href} className="underline underline-offset-4 hover:text-amber">
            {item.label}
          </Link>
          <p className="mt-1 text-sm text-muted">{formatDate(item.at)}</p>
        </li>
      ))}
    </ol>
  );
}
