import type { ApplicationStatus } from "@job-tracker/types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NOT_APPLIED: "Not applied",
  APPLIED: "Applied",
  HR_STAGE: "HR stage",
  TECHNICAL: "Technical",
  FINAL_INTERVIEW: "Final interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};
