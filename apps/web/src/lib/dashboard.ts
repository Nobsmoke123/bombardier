import type { DashboardStats, TodayQueueResponse } from "@job-tracker/types";
import { api } from "./api";

export function getDashboardStats() {
  return api<DashboardStats>("/dashboard/stats");
}

export function getTodayQueue() {
  return api<TodayQueueResponse>("/dashboard/today");
}

export function formatRate(value: number) {
  return `${Math.round(value * 100)}%`;
}
