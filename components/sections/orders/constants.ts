export const ORDER_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

export const ORDER_CREATOR_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "customer", label: "Customer" },
];

export const ORDER_STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-violet-50 text-violet-700 border-violet-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-orange-50 text-orange-700 border-orange-200",
};
