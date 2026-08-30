"use client";

import type { CompanyPublic } from "@job-tracker/types";
import Link from "next/link";
import { STATUS_LABELS } from "@/lib/application-labels";
import { formatDate } from "@/lib/resume-labels";

export function CompaniesTable({ companies }: { companies: CompanyPublic[] }) {
  if (companies.length === 0) {
    return (
      <p className="border-t border-line pt-8 text-muted">
        No companies match this view. Import a CSV or clear the search and
        status filter.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-line">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <caption className="sr-only">Companies and application status</caption>
        <thead>
          <tr className="border-b border-line text-muted">
            <th scope="col" className="py-3 pr-4 font-normal">
              Company
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              Role
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              Status
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              Resume
            </th>
            <th scope="col" className="py-3 pr-4 font-normal">
              Applied
            </th>
            <th scope="col" className="py-3 font-normal">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-b border-line/70">
              <td className="py-4 pr-4">
                <div>{company.name}</div>
                {company.industry ? (
                  <div className="text-muted">{company.industry}</div>
                ) : null}
              </td>
              <td className="py-4 pr-4 text-muted">
                {company.application.role || "—"}
              </td>
              <td className="py-4 pr-4">
                {STATUS_LABELS[company.application.status]}
              </td>
              <td className="py-4 pr-4 text-muted">
                {company.application.resumeTitle ?? "—"}
              </td>
              <td className="py-4 pr-4 text-muted">
                {company.application.applicationDate
                  ? formatDate(company.application.applicationDate)
                  : "—"}
              </td>
              <td className="py-4 text-right">
                <Link
                  href={`/companies/${company.id}`}
                  className="underline underline-offset-4 hover:text-amber"
                >
                  Track
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
