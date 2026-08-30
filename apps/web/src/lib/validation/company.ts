import { APPLICATION_STATUSES } from "@job-tracker/types";
import { z } from "zod";

export const updateCompanySchema = z.object({
  role: z.string().max(160).optional(),
  resumeId: z.union([z.string().uuid(), z.literal("")]).optional(),
  coverLetter: z.string().max(20000).optional(),
  linkedinMessage: z.string().max(5000).optional(),
  status: z.enum(APPLICATION_STATUSES),
  applicationDate: z.string().optional(),
  linkedinOutreach: z.boolean(),
});

export type UpdateCompanyValues = z.infer<typeof updateCompanySchema>;
