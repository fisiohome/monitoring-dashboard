import { apiFetch } from "./client";
import { SortOrder } from "./types";

export type AppointmentStatus =
  | "CANCELLED"
  | "PENDING PAYMENT"
  | "UNSCHEDULED"
  | "COMPLETED"
  | "PAID"
  | "PENDING PATIENT APPROVAL"
  | "PENDING THERAPIST ASSIGNMENT";

export interface FetchAppointmentsParams {
  patient_name?: string;
  therapist_name?: string;
  patient_number?: string;
  patient_id?: string;
  therapist_id?: string;
  order_id?: string; // UUID
  service_id?: number;
  package_id?: number;
  registration_number?: string;
  status?: string; // comma-separated, e.g. "SCHEDULED,CONFIRMED"
  date?: string; // YYYY-MM-DD
  start_date?: string; // ISO date-time
  end_date?: string; // ISO date-time
  is_soap_exists?: boolean;
  is_evidence_exists?: boolean;
  therapist_type?: "internal" | "external";
  page?: number; // default: 1
  limit?: number; // default: 20, max: 100
  sort_by?: string; // default: "appointment_date_time"
  sort_order?: SortOrder; // default: "desc"
}

export async function fetchAppointments(params?: FetchAppointmentsParams) {
  const queryString = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  return apiFetch<any>(`/api/v1/appointments?${queryString}`);
}

export async function fetchAppointmentById(id: string) {
  return apiFetch<any>(`/api/v1/appointments/${id}`);
}
