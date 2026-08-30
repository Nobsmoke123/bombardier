"use client";

import { APPLICATION_STATUSES } from "@job-tracker/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { STATUS_LABELS } from "@/lib/application-labels";

export function CompanyFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");

  function apply(next: { search?: string; status?: string }) {
    const query = new URLSearchParams(params.toString());
    query.delete("page");
    if (next.search !== undefined) {
      if (next.search) query.set("search", next.search);
      else query.delete("search");
    }
    if (next.status !== undefined) {
      if (next.status) query.set("status", next.status);
      else query.delete("status");
    }
    const suffix = query.size ? `?${query.toString()}` : "";
    router.push(`/companies${suffix}`);
  }

  return (
    <form
      className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        apply({ search: search.trim() });
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor="search" className="text-sm text-muted">
          Search
        </label>
        <input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Company name"
          className="h-12 rounded-sm border border-line bg-surface px-3"
        />
      </div>
      <div className="flex flex-col gap-2 sm:w-56">
        <label htmlFor="status" className="text-sm text-muted">
          Status
        </label>
        <select
          id="status"
          value={params.get("status") ?? ""}
          onChange={(event) => apply({ status: event.target.value })}
          className="h-12 rounded-sm border border-line bg-surface px-3"
        >
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="h-12 self-end px-5 bg-ink text-paper hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}
