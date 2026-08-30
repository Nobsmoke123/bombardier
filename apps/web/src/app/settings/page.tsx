"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/app-shell";
import { Field } from "@/components/auth/field";
import { getSettings, updateSettings } from "@/lib/settings";
import { settingsSchema, type SettingsValues } from "@/lib/validation/settings";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const settings = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { dailyTarget: 20 },
  });

  useEffect(() => {
    if (settings.data) {
      form.reset({ dailyTarget: settings.data.dailyTarget });
    }
  }, [settings.data, form]);

  const mutation = useMutation({
    mutationFn: (values: SettingsValues) => updateSettings(values),
    onSuccess: async (result) => {
      form.reset({ dailyTarget: result.dailyTarget });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  return (
    <AppShell
      title="Settings."
      lede="The daily target sizes today’s queue. Change it and the dashboard updates immediately."
    >
      {settings.isLoading ? (
        <p className="text-muted">Loading settings…</p>
      ) : settings.error ? (
        <p role="alert" className="text-error">
          {settings.error.message}
        </p>
      ) : (
        <form
          className="max-w-md border-t border-line pt-8"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          noValidate
        >
          <Field
            id="dailyTarget"
            label="Daily application target"
            type="number"
            min={1}
            max={100}
            hint="How many unapplied companies to pull into today’s queue."
            error={form.formState.errors.dailyTarget?.message}
            {...form.register("dailyTarget", { valueAsNumber: true })}
          />
          {mutation.error ? (
            <p role="alert" className="mt-4 text-sm text-error">
              {mutation.error.message}
            </p>
          ) : null}
          {mutation.isSuccess ? (
            <p className="mt-4 text-sm text-forest">
              Target saved. Today’s remaining count now uses {mutation.data.dailyTarget}.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-6 h-12 px-6 bg-ink text-paper hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending ? "Saving…" : "Save target"}
          </button>
        </form>
      )}
    </AppShell>
  );
}
