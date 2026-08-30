"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { ResumePublic } from "@job-tracker/types";
import { AppShell } from "@/components/app-shell";
import { ResumeTable } from "@/components/resumes/resume-table";
import { ResumeUploader } from "@/components/resumes/resume-uploader";
import { listResumes, viewResume } from "@/lib/resumes";

const PdfPreviewModal = dynamic(
  () =>
    import("@/components/resumes/pdf-preview-modal").then(
      (mod) => mod.PdfPreviewModal,
    ),
  { ssr: false },
);

export default function ResumesPage() {
  const [preview, setPreview] = useState<ResumePublic | null>(null);
  const resumes = useQuery({
    queryKey: ["resumes"],
    queryFn: listResumes,
  });
  const signed = useQuery({
    queryKey: ["resumes", preview?.id, "view"],
    queryFn: () => viewResume(preview!.id),
    enabled: Boolean(preview),
  });

  return (
    <AppShell
      title="Resumes."
      lede="Upload PDFs straight to object storage, then keep only the object key. Preview uses a 15-minute signed URL."
    >
      <section aria-labelledby="upload-heading">
        <h2 id="upload-heading" className="text-sm text-muted">
          Add a version
        </h2>
        <ResumeUploader />
      </section>
      <section aria-labelledby="list-heading" className="mt-14">
        <h2 id="list-heading" className="mb-4 text-sm text-muted">
          Stored versions
        </h2>
        {resumes.isLoading ? (
          <p className="border-t border-line pt-8 text-muted">Loading resumes…</p>
        ) : resumes.error ? (
          <p role="alert" className="border-t border-line pt-8 text-error">
            {resumes.error.message}
          </p>
        ) : (
          <ResumeTable
            resumes={resumes.data ?? []}
            onPreview={setPreview}
          />
        )}
      </section>
      {preview ? (
        <PdfPreviewModal
          title={preview.title}
          url={signed.data?.viewUrl ?? null}
          loading={signed.isLoading}
          error={signed.error?.message}
          onClose={() => setPreview(null)}
        />
      ) : null}
    </AppShell>
  );
}
