import { apiFetch } from "./client";

export async function sendFeedbackEmail(payload: {
  registration_number?: string;
  order_id?: string;
}) {
  return apiFetch<{ success: boolean; message: string }>(
    `/api/v1/feedbacks/send-email`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export interface OrderDetail {
  id: string;
  order_id: string;
  appointment_id: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackOrder {
  id: string;
  registration_number: string;
  booking_draft_id: string | null;
  user_id: string;
  patient_id: string;
  package_id: number;
  package_base_price: number;
  subtotal: number;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  VoucherID: string | null;
  voucher_code: string | null;
  tax_percentage: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: string;
  invoice_number: string;
  invoice_url: string;
  invoice_due_date: string;
  status: string;
  special_notes: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  Voucher: any;
  order_details: OrderDetail[];
}

export interface Feedback {
  id: string;
  order_id: string;
  registration_number: string;
  order: FeedbackOrder;
  patient_name: string;
  patient_phone: string;
  therapist_name: string;
  communication_rating: number;
  service_rating: number;
  effectiveness_rating: number;
  appearance_rating: number;
  average_rating: number;
  service_duration_sufficient: string;
  suggestion?: string;
  criticism?: string;
  issue?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FetchFeedbacksParams {
  user_id?: string;
  registration_number?: string;
  therapist_name?: string;
  patient_name?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  score?: string;
  has_comment?: string;
  page?: number;
  limit?: number;
}

export async function fetchFeedbacks(params?: FetchFeedbacksParams) {
  const queryString = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

  return apiFetch<Feedback[]>(`/api/v1/feedbacks?${queryString}`);
}

export async function fetchFeedbackById(id: string) {
  return apiFetch<Feedback>(`/api/v1/feedbacks/${id}`);
}
