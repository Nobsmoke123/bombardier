"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { CsvUploader } from "@/components/imports/csv-uploader";
import { listCsvImports } from "@/lib/imports";
import { formatDate } from "@/lib/resume-labels";

const STATUS_LABEL = {
  PENDING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
} as const;

export default function CompaniesPage() {
  const imports = useQuery({
    queryKey: ["imports"],
    queryFn: listCsvImports,
    refetchInterval: (query) =>
      query.state.data?.some((item) => item.status === "PENDING") ? 2000 : false,
  });

  return (
    <AppShell
      title="Companies."
      lede="Upload a CSV of companies. Duplicates collapse to one row per normalized name, including names already in your list."
    >
      <section aria-labelledby="import-heading">
        <h2 id="import-heading" className="text-sm text-muted">
          Import
        </h2>
        <CsvUploader />
      </section>
      <section aria-labelledby="history-heading" className="mt-14">
        <h2 id="history-heading" className="mb-4 text-sm text-muted">
          Import history
        </h2>
        {imports.isLoading ? (
          <p className="border-t border-line pt-8 text-muted">Loading imports…</p>
        ) : imports.error ? (
          <p role="alert" className="border-t border-line pt-8 text-error">
            {imports.error.message}
          </p>
        ) : !imports.data?.length ? (
          <p className="border-t border-line pt-8 text-muted">
            No imports yet. A finished job will show how many rows were unique
            and how many repeats were dropped.
          </p>
        ) : (
          <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="sr-only">CSV import jobs</caption>
              <thead>
                <tr className="border-b border-line text-muted">
                  <th scope="col" className="py-3 pr-4 font-normal">
                    File
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Status
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Rows
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Unique
                  </th>
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Duplicates
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {imports.data.map((item) => (
                  <tr key={item.id} className="border-b border-line/70">
                    <td className="py-4 pr-4">{item.filename}</td>
                    <td className="py-4 pr-4">
                      {STATUS_LABEL[item.status]}
                      {item.error ? (
                        <p className="mt-1 text-error">{item.error}</p>
                      ) : null}
                    </td>
                    <td className="py-4 pr-4 text-muted">{item.totalRows}</td>
                    <td className="py-4 pr-4 text-muted">{item.uniqueRows}</td>
                    <td className="py-4 pr-4 text-muted">
                      {item.duplicatesRemoved}
                    </td>
                    <td className="py-4 text-muted">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
