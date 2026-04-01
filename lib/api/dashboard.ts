import { apiFetch } from "./client";
import {
  DashboardMetrics,
  StuckOrder,
  DashboardSummary,
  DailyMetrics,
  PaymentReport,
} from "./types";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/api/v1/dashboard/summary");
}

export async function fetchDailyMetrics(date?: string): Promise<DailyMetrics> {
  const params = date ? `?date=${date}` : "";
  return apiFetch<DailyMetrics>(`/api/v1/dashboard/daily-metrics${params}`);
}

export async function fetchPaymentReport(params?: {
  view?: "monthly" | "weekly";
  year?: number;
  month?: number;
  status_filter?: string;
}): Promise<PaymentReport> {
  const queryString = params
    ? new URLSearchParams(params as any).toString()
    : "";
  return apiFetch<PaymentReport>(
    `/api/v1/dashboard/payment-report${queryString ? `?${queryString}` : ""}`,
  );
}
