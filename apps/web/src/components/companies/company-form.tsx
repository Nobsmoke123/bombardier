"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APPLICATION_STATUSES, type CompanyPublic, type ResumePublic } from "@job-tracker/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Field } from "@/components/auth/field";
import { STATUS_LABELS } from "@/lib/application-labels";
import { updateCompany } from "@/lib/companies";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  updateCompanySchema,
  type UpdateCompanyValues,
} from "@/lib/validation/company";

export function CompanyForm({
  company,
  resumes,
}: {
  company: CompanyPublic;
  resumes: ResumePublic[];
}) {
  const queryClient = useQueryClient();
  const form = useForm<UpdateCompanyValues>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      role: company.application.role,
      resumeId: company.application.resumeId ?? "",
      coverLetter: company.application.coverLetter ?? "",
      linkedinMessage: company.application.linkedinMessage ?? "",
      status: company.application.status,
      applicationDate: company.application.applicationDate?.slice(0, 10) ?? "",
      linkedinOutreach: company.application.linkedinOutreach,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: UpdateCompanyValues) =>
      updateCompany(company.id, {
        role: values.role,
        resumeId: values.resumeId || null,
        coverLetter: values.coverLetter || null,
        linkedinMessage: values.linkedinMessage || null,
        status: values.status,
        applicationDate: values.applicationDate
          ? new Date(values.applicationDate).toISOString()
          : null,
        linkedinOutreach: values.linkedinOutreach,
      }),
    onSuccess: async () => {
      toastSuccess("Application saved.");
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toastError(error, "Could not save the application"),
  });

  return (
    <form
      className="grid gap-5 border-t border-line pt-8"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <Field
        id="role"
        label="Role"
        placeholder="Backend engineer"
        error={form.formState.errors.role?.message}
        {...form.register("role")}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="resumeId" className="text-sm text-muted">
          Resume
        </label>
        <select
          id="resumeId"
          className="h-12 rounded-sm border border-line bg-surface px-3"
          {...form.register("resumeId")}
        >
          <option value="">No resume attached</option>
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm text-muted">
          Status
        </label>
        <select
          id="status"
          className="h-12 rounded-sm border border-line bg-surface px-3"
          {...form.register("status")}
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <Field
        id="applicationDate"
        label="Application date"
        type="date"
        {...form.register("applicationDate")}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="coverLetter" className="text-sm text-muted">
          Cover letter
        </label>
        <textarea
          id="coverLetter"
          rows={6}
          className="rounded-sm border border-line bg-surface px-3 py-2"
          {...form.register("coverLetter")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="linkedinMessage" className="text-sm text-muted">
          LinkedIn message
        </label>
        <textarea
          id="linkedinMessage"
          rows={4}
          className="rounded-sm border border-line bg-surface px-3 py-2"
          {...form.register("linkedinMessage")}
        />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" {...form.register("linkedinOutreach")} />
        LinkedIn outreach sent
      </label>
      {mutation.error ? (
        <p role="alert" className="text-sm text-error">
          {mutation.error.message}
        </p>
      ) : null}
      {mutation.isSuccess ? (
        <p className="text-sm text-forest">Saved.</p>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="h-12 w-fit px-6 bg-ink text-paper hover:opacity-90 disabled:opacity-60"
      >
        {mutation.isPending ? "Saving…" : "Save application"}
      </button>
    </form>
  );
}
