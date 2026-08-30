import type { ConnectionStatus } from "@job-tracker/types";

export const CONNECTION_LABELS: Record<ConnectionStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  CONVERSING: "Conversing",
};
