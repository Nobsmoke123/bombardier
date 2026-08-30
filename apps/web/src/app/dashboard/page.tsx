"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutRequest, meRequest } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const session = useQuery({
    queryKey: ["auth", "me"],
    queryFn: meRequest,
  });

  async function onLogout() {
    await logoutRequest();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 py-16 sm:px-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-sm tracking-wide text-amber">Job Tracker</p>
        <button
          type="button"
          onClick={onLogout}
          className="text-sm text-muted underline underline-offset-4 hover:text-ink"
        >
          Sign out
        </button>
      </div>
      <h1 className="mt-8 font-display text-5xl leading-none tracking-tight">
        You are in.
      </h1>
      <p className="mt-5 max-w-xl text-muted">
        Authentication is live. The rest of the tracker — resumes, companies, and
        the daily queue — lands in later milestones.
      </p>
      <section className="mt-10 border-t border-line pt-8">
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
      </section>
    </main>
  );
}
