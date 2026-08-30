"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { meRequest } from "@/lib/auth";

export default function DashboardPage() {
  const session = useQuery({
    queryKey: ["auth", "me"],
    queryFn: meRequest,
  });

  return (
    <AppShell
      title="You are in."
      lede="Resumes and company CSVs upload directly to R2. Outreach and the daily queue come next."
    >
      <section className="border-t border-line pt-8">
        <h2 className="text-sm text-muted">Signed in as</h2>
        {session.isLoading ? (
          <p className="mt-3 text-ink">Loading session…</p>
        ) : session.error ? (
          <p className="mt-3 text-error">{session.error.message}</p>
        ) : (
          <dl className="mt-4 grid gap-3 text-base">
            <div>
              <dt className="text-muted">Name</dt>
              <dd>{session.data?.user.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd>{session.data?.user.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Daily target</dt>
              <dd>{session.data?.user.dailyTarget} applications</dd>
            </div>
          </dl>
        )}
        <p className="mt-8 flex flex-wrap gap-5">
          <Link href="/resumes" className="underline underline-offset-4 hover:text-amber">
            Manage resumes
          </Link>
          <Link href="/companies" className="underline underline-offset-4 hover:text-amber">
            Import companies
          </Link>
        </p>
      </section>
    </AppShell>
  );
}
