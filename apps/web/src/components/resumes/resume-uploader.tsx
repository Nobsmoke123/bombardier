"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RESUME_FOCUSES } from "@job-tracker/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/auth/field";
import { FOCUS_LABELS } from "@/lib/resume-labels";
import { uploadResumePdf } from "@/lib/resumes";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  resumeUploadSchema,
  type ResumeUploadValues,
} from "@/lib/validation/resume";

export function ResumeUploader() {
  const queryClient = useQueryClient();
  const form = useForm<ResumeUploadValues>({
    resolver: zodResolver(resumeUploadSchema),
    defaultValues: { title: "", focus: "BACKEND" },
  });

  const mutation = useMutation({
    mutationFn: (values: ResumeUploadValues) =>
      uploadResumePdf({
        title: values.title,
        focus: values.focus,
        file: values.file,
      }),
    onSuccess: async () => {
      form.reset({ title: "", focus: "BACKEND" });
      toastSuccess("Resume stored.");
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toastError(error, "Could not upload the resume"),
  });

  return (
    <form
      className="grid gap-5 border-t border-line pt-8 md:grid-cols-2"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <Field
        id="title"
        label="Version name"
        placeholder="Backend — Spring 2026"
        error={form.formState.errors.title?.message}
        {...form.register("title")}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="focus" className="text-sm text-muted">
          Focus
        </label>
        <select
          id="focus"
          className="h-12 rounded-sm border border-line bg-surface px-3 text-ink"
          {...form.register("focus")}
        >
          {RESUME_FOCUSES.map((focus) => (
            <option key={focus} value={focus}>
              {FOCUS_LABELS[focus]}
            </option>
          ))}
        </select>
        {form.formState.errors.focus?.message ? (
          <p role="alert" className="text-sm text-error">
            {form.formState.errors.focus.message}
          </p>
        ) : null}
      </div>
      <Controller
        control={form.control}
        name="file"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="file" className="text-sm text-muted">
              PDF
            </label>
            <input
              id="file"
              type="file"
              accept="application/pdf,.pdf"
              className="h-12 rounded-sm border border-line bg-surface px-3 py-2 text-ink file:mr-4 file:border-0 file:bg-transparent file:text-sm file:text-muted"
              onChange={(event) => field.onChange(event.target.files?.[0])}
            />
            {fieldState.error?.message ? (
              <p role="alert" className="text-sm text-error">
                {fieldState.error.message}
              </p>
            ) : (
              <p className="text-sm text-muted">
                The file goes straight to object storage. The API only keeps the
                object key.
              </p>
            )}
          </div>
        )}
      />
      {mutation.error ? (
        <p role="alert" className="text-sm text-error md:col-span-2">
          {mutation.error.message}
        </p>
      ) : null}
      {mutation.isSuccess ? (
        <p className="text-sm text-forest md:col-span-2">Resume stored.</p>
      ) : null}
      <div className="flex items-center gap-4 md:col-span-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-12 px-6 bg-ink text-paper transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Uploading…" : "Upload resume"}
        </button>
        {mutation.isPending ? (
          <p className="text-sm text-muted" aria-live="polite">
            Sending the PDF to storage, then saving the object key.
          </p>
        ) : null}
      </div>
    </form>
  );
}
