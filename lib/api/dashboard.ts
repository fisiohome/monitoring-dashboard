import { apiFetch } from "./client";
import {
  DashboardMetrics,
  StuckOrder,
  DashboardSummary,
  DailyMetrics,
  PaymentReport,
  ReminderDataResponse,
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

export interface FetchReminderDataParams {
  date?: string;
  start_date?: string;
  end_date?: string;
  patient_name?: string;
  therapist_type?: "internal" | "external" | "both";
  page?: number;
  limit?: number;
}

export async function fetchReminderData(params?: FetchReminderDataParams) {
  const query = params
    ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";
  return apiFetch<ReminderDataResponse & { meta?: any }>(
    `/api/v1/dashboard/reminder-data${query ? `?${query}` : ""}`
  );
}
