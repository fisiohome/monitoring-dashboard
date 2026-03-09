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

// Unused, old code
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    // Parallel fetch for overview data
    // Using bookings for both orders and payments since /payments is not available
    const bookingsRes = await apiFetch<any>("/api/v1/bookings?page_size=100");
    const bookings = Array.isArray(bookingsRes)
      ? bookingsRes
      : bookingsRes.bookings || [];

    // Logic - Calculate Orders Today
    const today = new Date().toISOString().split("T")[0];
    const todaysBookings = bookings.filter((b: any) =>
      b.created_at?.startsWith(today),
    );

    const successOrders = todaysBookings.filter(
      (b: any) => b.status === "COMPLETED" || b.status === "INFO_COMPLETE",
    ).length;
    const failedOrders = todaysBookings.filter(
      (b: any) => b.status === "CANCELLED",
    ).length;

    // Stuck Orders: > 30 mins and status is PENDING or MATCHING
    const now = new Date();
    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const stuckOrdersList = bookings.filter((b: any) => {
      const created = new Date(b.created_at);
      return (
        (b.status === "PENDING_PAYMENT" || b.status === "MATCHING_THERAPIST") &&
        created < thirtyMinsAgo
      );
    });

    // Derive Payment Metrics from Bookings
    const pendingPayments = bookings.filter(
      (b: any) => b.status === "PENDING_PAYMENT",
    );
    const successPayments = bookings.filter(
      (b: any) => b.payment_status === "PAID",
    ).length;
    const totalPayments =
      bookings.filter((b: any) => b.payment_status).length || 1;

    // Calculate Revenue (This Month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = bookings
      .filter((b: any) => {
        if (b.payment_status !== "PAID") return false;
        const date = new Date(b.created_at || b.date);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum: number, b: any) => sum + (b.total_amount || b.total_price || 0),
        0,
      );

    return {
      funnel: {
        users: 1000,
        registrations: 800,
        bookings_started: todaysBookings.length,
        bookings_completed: successOrders,
        payments_success: todaysBookings.filter(
          (b: any) => b.payment_status === "PAID",
        ).length,
        registration_drop_alert: false,
      },
      orders: {
        total_today: todaysBookings.length,
        success: successOrders,
        failed: failedOrders,
        stuck_count: stuckOrdersList.length,
      },
      auto_assign: {
        total: 10,
        success: 8,
        failed: 2,
      },
      reschedule: {
        total: 5,
        success: 5,
        failed: 0,
      },
      payment: {
        success_rate: Math.round((successPayments / totalPayments) * 100),
        failed_count: bookings.filter(
          (b: any) =>
            b.payment_status === "REFUNDED" || b.payment_status === "FAILED",
        ).length,
        pending_stuck_count: pendingPayments.length,
      },
      revenue: {
        total_this_month: monthlyRevenue,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics", error);
    return {
      funnel: {
        users: 0,
        registrations: 0,
        bookings_started: 0,
        bookings_completed: 0,
        payments_success: 0,
        registration_drop_alert: false,
      },
      orders: { total_today: 0, success: 0, failed: 0, stuck_count: 0 },
      auto_assign: { total: 0, success: 0, failed: 0 },
      reschedule: { total: 0, success: 0, failed: 0 },
      payment: { success_rate: 0, failed_count: 0, pending_stuck_count: 0 },
      revenue: { total_this_month: 0 },
    };
  }
}

// Unused, old code
export async function fetchStuckOrders(): Promise<StuckOrder[]> {
  try {
    const res: any = await apiFetch(
      "/api/v1/bookings?status=PENDING_PAYMENT&page_size=50",
    );
    const bookings = Array.isArray(res) ? res : res.bookings || [];

    const now = new Date();
    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

    return bookings
      .filter((b: any) => {
        const created = new Date(b.created_at);
        return created < thirtyMinsAgo;
      })
      .map((b: any) => ({
        id: b.id,
        registration_number: b.registration_number,
        customer_name:
          b.patient?.name ||
          b.customer?.full_name ||
          b.customer?.name ||
          b.user?.name ||
          b.user?.email ||
          "Unknown Customer",
        customer_phone:
          b.patient?.phone_number ||
          b.patient?.phone ||
          b.customer?.phone_number ||
          b.customer?.phone ||
          b.user?.phone_number,
        status: b.status,
        time_elapsed: "30+ mins",
        step: b.status === "PENDING_PAYMENT" ? "Payment" : "Matching",
        created_at: b.created_at,
      }))
      .slice(0, 5);
  } catch (e) {
    return [];
  }
}
