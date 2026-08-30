import { RESUME_FOCUSES } from "@job-tracker/types";
import { z } from "zod";

export const resumeUploadSchema = z.object({
  title: z.string().trim().min(1, "Give this version a name").max(120),
  focus: z.enum(RESUME_FOCUSES, { error: "Choose a focus" }),
  file: z
    .custom<File>((value) => value instanceof File && value.size > 0, {
      error: "Choose a PDF",
    })
    .refine((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"), {
      error: "Only PDF files can be stored as resumes",
    }),
});

export type ResumeUploadValues = z.infer<typeof resumeUploadSchema>;
