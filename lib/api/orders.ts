import Cookies from "js-cookie";
import { apiFetch } from "./client";
import { API_BASE_URL } from "./config";
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

export async function exportOrdersReport(params?: {
  creator_type?: "admin" | "customer" | "";
  order_start_date?: string;
  order_end_date?: string;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  const token = Cookies.get("access_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    `${API_BASE_URL}/api/v1/bookings/report/export?${queryString}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!res.ok) {
    let errorMsg = "Failed to export report";
    try {
      const errData = await res.json();
      if (errData.message) errorMsg = errData.message;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  return res.blob();
}

export async function exportContactsReport(params?: {
  creator_type?: "admin" | "customer" | "";
  order_start_date?: string;
  order_end_date?: string;
}) {
  const queryString = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  const token = Cookies.get("access_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    `${API_BASE_URL}/api/v1/bookings/report/export/contacts?${queryString}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!res.ok) {
    let errorMsg = "Failed to export contacts report";
    try {
      const errData = await res.json();
      if (errData.message) errorMsg = errData.message;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  return res.blob();
}
