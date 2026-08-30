"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CompanyForm } from "@/components/companies/company-form";
import { LinkedInContacts } from "@/components/linkedin/linkedin-contacts";
import { getCompany } from "@/lib/companies";
import { listResumes } from "@/lib/resumes";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const company = useQuery({
    queryKey: ["companies", id],
    queryFn: () => getCompany(id),
  });
  const resumes = useQuery({
    queryKey: ["resumes"],
    queryFn: listResumes,
  });

  return (
    <AppShell
      title={company.data?.name ?? "Company"}
      lede="Set the role, attach a resume, and track the people you message on LinkedIn."
      action={
        <Link href="/companies" className="text-sm underline underline-offset-4 hover:text-amber">
          Back to companies
        </Link>
      }
    >
      {company.data?.website ? (
        <p className="mb-6 text-sm">
          <a
            href={company.data.website}
            className="underline underline-offset-4 hover:text-amber"
            target="_blank"
            rel="noreferrer"
          >
            {company.data.website}
          </a>
        </p>
      ) : null}
      {company.isLoading || resumes.isLoading ? (
        <p className="text-muted">Loading this company…</p>
      ) : company.error ? (
        <p role="alert" className="text-error">
          {company.error.message}
        </p>
      ) : company.data ? (
        <>
          <CompanyForm company={company.data} resumes={resumes.data ?? []} />
          <LinkedInContacts
            applicationId={company.data.application.id}
            connectionCount={company.data.application.connectionCount}
          />
        </>
      ) : null}
    </AppShell>
  );
}
