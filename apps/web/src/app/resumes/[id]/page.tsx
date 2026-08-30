"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FOCUS_LABELS, formatDate } from "@/lib/resume-labels";
import { deleteResume, getResume, viewResume } from "@/lib/resumes";
import { toastError, toastSuccess } from "@/lib/toast";

const PdfPreviewModal = dynamic(
  () =>
    import("@/components/resumes/pdf-preview-modal").then(
      (mod) => mod.PdfPreviewModal,
    ),
  { ssr: false },
);

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const resume = useQuery({
    queryKey: ["resumes", id],
    queryFn: () => getResume(id),
  });
  const signed = useQuery({
    queryKey: ["resumes", id, "view"],
    queryFn: () => viewResume(id),
    enabled: previewOpen,
  });
  const remove = useMutation({
    mutationFn: () => deleteResume(id),
    onSuccess: async () => {
      toastSuccess("Resume deleted.");
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      router.push("/resumes");
    },
    onError: (error) => toastError(error, "Could not delete the resume"),
  });

  return (
    <AppShell
      title={resume.data?.title ?? "Resume"}
      lede="This record stores metadata and an object key. Delete removes both the database row and the file in R2."
    >
      {resume.isLoading ? (
        <p className="text-muted">Loading this version…</p>
      ) : resume.error ? (
        <p role="alert" className="text-error">
          {resume.error.message}
        </p>
      ) : resume.data ? (
        <section className="border-t border-line pt-8">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted">Focus</dt>
              <dd className="mt-1">{FOCUS_LABELS[resume.data.focus]}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Added</dt>
              <dd className="mt-1">{formatDate(resume.data.createdAt)}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="h-12 px-6 bg-ink text-paper hover:opacity-90"
            >
              Preview PDF
            </button>
            {confirmDelete ? (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted">Delete the file and the record?</p>
                <button
                  type="button"
                  onClick={() => remove.mutate()}
                  disabled={remove.isPending}
                  className="h-12 px-5 bg-error text-paper disabled:opacity-60"
                >
                  {remove.isPending ? "Deleting…" : "Delete permanently"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="h-12 px-5 text-muted underline underline-offset-4"
                >
                  Keep it
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="h-12 px-6 text-error underline underline-offset-4"
              >
                Delete
              </button>
            )}
          </div>
          {remove.error ? (
            <p role="alert" className="mt-4 text-sm text-error">
              {remove.error.message}
            </p>
          ) : null}
        </section>
      ) : null}
      {previewOpen ? (
        <PdfPreviewModal
          title={resume.data?.title ?? "Resume"}
          url={signed.data?.viewUrl ?? null}
          loading={signed.isLoading}
          error={signed.error?.message}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </AppShell>
  );
}
