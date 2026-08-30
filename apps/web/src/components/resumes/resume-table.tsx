"use client";

import type { ResumePublic } from "@job-tracker/types";
import Link from "next/link";
import { FOCUS_LABELS, formatDate } from "@/lib/resume-labels";

export function ResumeTable({
  resumes,
  onPreview,
}: {
  resumes: ResumePublic[];
  onPreview: (resume: ResumePublic) => void;
}) {
  if (resumes.length === 0) {
    return (
      <p className="border-t border-line pt-8 text-muted">
        No versions stored yet. Name a PDF above and it will sit in this list —
        one row per file, never a public URL.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-line">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <caption className="sr-only">Uploaded resumes</caption>
        <thead>
          <tr className="border-b border-line text-muted">
            <th scope="col" className="py-3 pr-4 font-normal">
              Version
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              Focus
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              Added
            </th>
            <th scope="col" className="py-3 font-normal">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((resume) => (
            <tr key={resume.id} className="border-b border-line/70">
              <td className="py-4 pr-4 text-ink">{resume.title}</td>
              <td className="py-4 pr-4 text-muted">{FOCUS_LABELS[resume.focus]}</td>
              <td className="py-4 pr-4 text-muted">{formatDate(resume.createdAt)}</td>
              <td className="py-4">
                <div className="flex flex-wrap justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => onPreview(resume)}
                    className="underline underline-offset-4 hover:text-amber"
                  >
                    Preview
                  </button>
                  <Link
                    href={`/resumes/${resume.id}`}
                    className="underline underline-offset-4 hover:text-amber"
                  >
                    Open
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
