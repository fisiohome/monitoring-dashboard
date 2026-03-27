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
