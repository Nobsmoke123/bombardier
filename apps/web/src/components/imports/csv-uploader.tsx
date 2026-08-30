"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { uploadCompaniesCsv } from "@/lib/imports";
import { csvUploadSchema, type CsvUploadValues } from "@/lib/validation/import";

export function CsvUploader() {
  const queryClient = useQueryClient();
  const form = useForm<CsvUploadValues>({
    resolver: zodResolver(csvUploadSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: CsvUploadValues) => uploadCompaniesCsv(values.file),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["imports"] });
    },
  });

  return (
    <form
      className="grid gap-5 border-t border-line pt-8"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <Controller
        control={form.control}
        name="file"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <label htmlFor="csv" className="text-sm text-muted">
              Companies CSV
            </label>
            <input
              id="csv"
              type="file"
              accept=".csv,text/csv"
              className="h-12 rounded-sm border border-line bg-surface px-3 py-2 text-ink file:mr-4 file:border-0 file:bg-transparent file:text-sm file:text-muted"
              onChange={(event) => field.onChange(event.target.files?.[0])}
            />
            {fieldState.error?.message ? (
              <p role="alert" className="text-sm text-error">
                {fieldState.error.message}
              </p>
            ) : (
              <p className="text-sm text-muted">
                Needs a name column (`name`, `company`, or `company_name`).
                Website and industry are optional. The file uploads to R2; a
                background job inserts unique companies.
              </p>
            )}
          </div>
        )}
      />
      {mutation.error ? (
        <p role="alert" className="text-sm text-error">
          {mutation.error.message}
        </p>
      ) : null}
      {mutation.isSuccess ? (
        <p className="text-sm text-forest">
          Import queued. Stats appear when the worker finishes.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="h-12 w-fit px-6 bg-ink text-paper transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Uploading…" : "Import companies"}
      </button>
    </form>
  );
}
