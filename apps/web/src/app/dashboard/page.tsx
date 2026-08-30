"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { ApplicationStatusChart } from "@/components/dashboard/application-status-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { ResumePerformanceChart } from "@/components/dashboard/resume-performance-chart";
import { TodayQueue } from "@/components/dashboard/today-queue";
import { formatRate, getDashboardStats, getTodayQueue } from "@/lib/dashboard";

export default function DashboardPage() {
  const stats = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
  const today = useQuery({
    queryKey: ["dashboard", "today"],
    queryFn: getTodayQueue,
  });

  return (
    <AppShell
      title="Today."
      lede="How the search is going, and the next companies to touch before the day is done."
    >
      {stats.isLoading ? (
        <p className="text-muted">Loading analytics…</p>
      ) : stats.error ? (
        <p role="alert" className="text-error">
          {stats.error.message}
        </p>
      ) : stats.data ? (
        <>
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total applied"
              value={stats.data.applied}
              hint={`${stats.data.notApplied} still outstanding`}
            />
            <MetricCard
              label="Outstanding"
              value={stats.data.notApplied}
              hint={`${stats.data.totalCompanies} companies in the list`}
            />
            <MetricCard
              label="Interview rate"
              value={formatRate(stats.data.interviewRate)}
              hint={`Offer rate ${formatRate(stats.data.offerRate)}`}
            />
            <MetricCard
              label="LinkedIn success"
              value={formatRate(stats.data.linkedinSuccessRate)}
              hint={`${stats.data.totalLinkedinOutreach} outreach records`}
            />
          </section>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <AnalyticsCard title="Application stages">
              <ApplicationStatusChart breakdown={stats.data.statusBreakdown} />
            </AnalyticsCard>
            <AnalyticsCard title="Today’s companies">
              <ProgressCard
                label="Daily target"
                value={stats.data.appliedToday}
                max={stats.data.dailyTarget}
              />
              <p className="mt-4 mb-6 text-sm text-muted">
                {stats.data.todaysRemaining} remaining today.
              </p>
              {today.isLoading ? (
                <p className="text-muted">Loading today’s queue…</p>
              ) : today.error ? (
                <p role="alert" className="text-error">
                  {today.error.message}
                </p>
              ) : today.data ? (
                <TodayQueue queue={today.data} />
              ) : null}
            </AnalyticsCard>
          </div>
          <div className="mt-12">
            <AnalyticsCard title="Resume performance">
              <ResumePerformanceChart rows={stats.data.resumePerformance} />
            </AnalyticsCard>
          </div>
        </>
      ) : null}
    </AppShell>
  );
}
