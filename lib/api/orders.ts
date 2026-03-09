import { apiFetch } from "./client";
import { SortOrder } from "./types";

type OrdersFilter = {
  // Filter by specific IDs
  order_id?: string;
  patient_id?: string;
  user_id?: string;
  therapist_id?: string;
  appointment_id?: string;
  service_id?: number;
  package_id?: number;

  // Filter by status
  status?: string;
  payment_status?: string;

  // Filter by date range (order created_at)
  order_start_date?: string; // ISO 8601
  order_end_date?: string;

  // Filter by appointment date range
  appointment_start_date?: string;
  appointment_end_date?: string;

  // Search by registration number
  registration_number?: string;

  // Filter by patient details
  patient_name?: string;
  patient_number?: string;

  // Filter by therapist details
  therapist_name?: string;

  // Pagination
  page: number;
  limit: number;

  // Sorting
  sort_by: string;
  sort_order: SortOrder;

  // Filter by order creator type: "admin" | "customer"
  creator_type?: "admin" | "customer";
};

export async function fetchOrders(params?: OrdersFilter) {
  const queryString = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  return apiFetch<any>(`/api/v1/bookings?${queryString}`);
}

export async function fetchOrderById(id: string) {
  return apiFetch<any>(`/api/v1/bookings/${id}`);
}
