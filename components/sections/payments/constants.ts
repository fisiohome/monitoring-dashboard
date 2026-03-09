export const PAYMENT_STATUS_OPTIONS = [
  { value: "PAID", label: "Paid" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

export const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  UNPAID: "bg-slate-100 text-slate-600 border-slate-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-orange-50 text-orange-700 border-orange-200",
};

export const PAYMENT_SORT_OPTIONS = [
  { value: "created_at", label: "Date" },
  { value: "registration_number", label: "Registration No." },
  { value: "total_amount", label: "Amount" },
];
