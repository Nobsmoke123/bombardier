import { z } from "zod";

export const settingsSchema = z.object({
  dailyTarget: z
    .number({ error: "Enter a number" })
    .int("Use a whole number")
    .min(1, "At least one application a day")
    .max(100, "Keep the daily target at 100 or below"),
});

export type SettingsValues = z.infer<typeof settingsSchema>;
