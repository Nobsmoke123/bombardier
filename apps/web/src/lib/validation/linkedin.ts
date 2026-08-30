import { CONNECTION_STATUSES } from "@job-tracker/types";
import { z } from "zod";

export const createLinkedInContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  position: z.string().trim().min(1, "Position is required").max(160),
  status: z.enum(CONNECTION_STATUSES),
  conversationNotes: z.string().max(10000).optional(),
});

export type CreateLinkedInContactValues = z.infer<
  typeof createLinkedInContactSchema
>;
