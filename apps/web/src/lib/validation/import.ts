import { z } from "zod";

export const csvUploadSchema = z.object({
  file: z
    .custom<File>((value) => value instanceof File && value.size > 0, {
      error: "Choose a CSV",
    })
    .refine(
      (file) =>
        file.name.toLowerCase().endsWith(".csv") ||
        ["text/csv", "application/csv", "application/vnd.ms-excel", "text/plain"].includes(
          file.type,
        ),
      { error: "Only CSV files can be imported" },
    ),
});

export type CsvUploadValues = z.infer<typeof csvUploadSchema>;
