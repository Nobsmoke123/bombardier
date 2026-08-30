import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { CompaniesDirectory } from "./companies-directory";

export default function CompaniesPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="Companies." lede="Loading the tracker…">
          <p className="text-muted">Loading companies…</p>
        </AppShell>
      }
    >
      <CompaniesDirectory />
    </Suspense>
  );
}
