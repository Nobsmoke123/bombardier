"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfPreviewModalProps = {
  title: string;
  url: string | null;
  loading: boolean;
  error?: string;
  onClose: () => void;
};

export function PdfPreviewModal({
  title,
  url,
  loading,
  error,
  onClose,
}: PdfPreviewModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!node.open) node.showModal();

    function onCancel(event: Event) {
      event.preventDefault();
      onClose();
    }

    node.addEventListener("cancel", onCancel);
    return () => node.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="pdf-preview-title"
      className="fixed inset-0 m-auto h-[min(90dvh,52rem)] w-[min(96vw,56rem)] border border-line bg-surface p-0 text-ink shadow-none backdrop:bg-ink/40"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id="pdf-preview-title" className="font-display text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm underline underline-offset-4 hover:text-amber"
          >
            Close
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-auto bg-paper p-4">
          {loading ? (
            <p className="text-muted">Fetching a temporary view URL…</p>
          ) : error ? (
            <p role="alert" className="text-error">
              {error}
            </p>
          ) : url ? (
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setPages(numPages)}
              loading={<p className="text-muted">Rendering PDF…</p>}
              error={
                <p role="alert" className="text-error">
                  The signed URL could not be rendered. Try opening the resume
                  page and previewing again.
                </p>
              }
            >
              {Array.from({ length: pages }, (_, index) => (
                <Page
                  key={index + 1}
                  pageNumber={index + 1}
                  width={720}
                  className="mb-4 bg-surface"
                />
              ))}
            </Document>
          ) : (
            <p className="text-muted">No preview available.</p>
          )}
        </div>
      </div>
    </dialog>
  );
}
