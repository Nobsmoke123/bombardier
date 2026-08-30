import type { ResumeFocus } from "@job-tracker/types";

export const FOCUS_LABELS: Record<ResumeFocus, string> = {
  BACKEND: "Backend",
  FULLSTACK: "Full-stack",
  FRONTEND: "Frontend",
  DEVOPS: "DevOps",
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
