"use client";

import { useQuery } from "@tanstack/react-query";
import { APPLICATION_STATUSES } from "@job-tracker/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CompaniesTable } from "@/components/companies/companies-table";
import { CompanyFilters } from "@/components/companies/company-filters";
import { CsvUploader } from "@/components/imports/csv-uploader";
import { listCompanies } from "@/lib/companies";
import { listCsvImports } from "@/lib/imports";
import { formatDate } from "@/lib/resume-labels";

const IMPORT_LABEL = {
  PENDING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
} as const;

export function CompaniesDirectory() {
  const params = useSearchParams();
  const page = Number(params.get("page") ?? 1);
  const search = params.get("search") ?? undefined;
  const statusParam = params.get("status");
  const status = APPLICATION_STATUSES.find((value) => value === statusParam);

  const companies = useQuery({
    queryKey: ["companies", { page, search, status }],
    queryFn: () =>
      listCompanies({
        page,
        pageSize: 20,
        search,
        status,
      }),
  });
  const imports = useQuery({
    queryKey: ["imports"],
    queryFn: listCsvImports,
    refetchInterval: (query) =>
      query.state.data?.some((item) => item.status === "PENDING") ? 2000 : false,
  });

  const totalPages = companies.data
    ? Math.max(1, Math.ceil(companies.data.total / companies.data.pageSize))
    : 1;

  return (
    <AppShell
      title="Companies."
      lede="Search the list, filter by stage, and open a company to set the role, resume, and outreach."
    >
      <section aria-labelledby="list-heading">
        <h2 id="list-heading" className="text-sm text-muted">
          Tracker
        </h2>
        <CompanyFilters />
        {companies.isLoading ? (
          <p className="mt-6 text-muted">Loading companies…</p>
        ) : companies.error ? (
          <p role="alert" className="mt-6 text-error">
            {companies.error.message}
          </p>
        ) : (
          <>
            <p className="mt-6 text-sm text-muted">
              {companies.data?.total ?? 0} companies
            </p>
            <CompaniesTable companies={companies.data?.items ?? []} />
            {totalPages > 1 ? (
              <nav
                aria-label="Pagination"
                className="mt-6 flex items-center justify-between text-sm"
              >
                <PageLink
                  page={page - 1}
                  disabled={page <= 1}
                  label="Previous"
                />
                <p className="text-muted">
                  Page {page} of {totalPages}
                </p>
                <PageLink
                  page={page + 1}
                  disabled={page >= totalPages}
                  label="Next"
                />
              </nav>
            ) : null}
          </>
        )}
      </section>
      <section aria-labelledby="import-heading" className="mt-16">
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
            No imports yet. A finished job will show unique rows and dropped
            repeats.
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
                    Unique
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
                      {IMPORT_LABEL[item.status]}
                      {item.error ? (
                        <p className="mt-1 text-error">{item.error}</p>
                      ) : null}
                    </td>
                    <td className="py-4 pr-4 text-muted">{item.uniqueRows}</td>
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

function PageLink({
  page,
  disabled,
  label,
}: {
  page: number;
  disabled: boolean;
  label: string;
}) {
  const params = useSearchParams();
  const query = new URLSearchParams(params.toString());
  if (page <= 1) query.delete("page");
  else query.set("page", String(page));
  const href = query.size ? `/companies?${query.toString()}` : "/companies";

  if (disabled) {
    return <span className="text-muted/60">{label}</span>;
  }

  return (
    <Link href={href} className="underline underline-offset-4 hover:text-amber">
      {label}
    </Link>
  );
}
