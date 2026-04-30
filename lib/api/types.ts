// --- Types ---

export interface DashboardMetrics {
  funnel: {
    users: number;
    registrations: number;
    bookings_started: number;
    bookings_completed: number;
    payments_success: number;
    registration_drop_alert: boolean;
  };
  orders: {
    total_today: number;
    success: number;
    failed: number;
    stuck_count: number;
  };
  auto_assign: {
    total: number;
    success: number;
    failed: number;
  };
  reschedule: {
    total: number;
    success: number;
    failed: number;
  };
  payment: {
    success_rate: number;
    failed_count: number;
    pending_stuck_count: number;
  };
  revenue: {
    total_this_month: number;
  };
}

export interface StuckOrder {
  id: string;
  registration_number?: string;
  customer_name: string;
  customer_phone?: string;
  status: string;
  time_elapsed: string;
  step: "Matching" | "Payment";
  created_at?: string;
}

export interface DashboardSummary {
  total_income_this_month: number;
  total_orders_today: number;
  order_success: {
    count: number;
    total: number;
    rate: number;
    success_statuses: string[];
    failed_statuses: string[];
  };
  stuck_orders: {
    threshold_minutes: number;
    count: number;
    orders: Array<{
      id: string;
      registration_number: string;
      total_amount: number;
      created_at: string;
      age_minutes: number;
      user: {
        id: string;
        email: string;
        phone: string | null;
      };
    }>;
  };
  pending_payments: {
    statuses: string[];
    count: number;
  };
}

export interface DailyMetrics {
  date: string;
  total_users: number;
  new_users_today: number;
  total_visits_today: number;
  completed_visits_today: number;
  paid_orders_today: number;
}

export interface PaymentReport {
  meta: {
    view: string;
    year: number | null;
    month: number | null;
    status_filter: string[];
  };
  total: {
    by_status: Record<string, { revenue: number; orders: number }>;
    combined_revenue: number;
    combined_orders: number;
    avg_revenue_per_period: Record<string, number>;
  };
  trend: Array<{
    period: string;
    label: string;
    by_status: Record<string, number>;
  }>;
  breakdown: Array<{
    period: string;
    label: string;
    by_status: Record<
      string,
      {
        revenue: number;
        total_orders: number;
        discount_amount: number;
        tax_amount: number;
        avg_order_value: number;
      }
    >;
  }>;
}

export type SortOrder = "asc" | "desc";

export interface ReminderDataItem {
  therapist_name: string;
  therapist_type: "internal" | "external";
  therapist_email: string;
  patient_name: string;
  status: string;
  appt_date_time_wib: string;
}

export interface ReminderDataResponse {
  date: string;
  start_date: string;
  end_date: string;
  patient_name: string;
  therapist_type: "internal" | "external" | "both";
  items: ReminderDataItem[];
}
