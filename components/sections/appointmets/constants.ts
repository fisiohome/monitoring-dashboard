export const STATUS_OPTIONS = [
  { value: "UNSCHEDULED", label: "Unscheduled" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "PENDING PAYMENT", label: "Pending Payment" },
  { value: "PAID", label: "Paid" },
  { value: "PENDING PATIENT APPROVAL", label: "Pending Patient Approval" },
  {
    value: "PENDING THERAPIST ASSIGNMENT",
    label: "Pending Therapist Assignment",
  },
];

export const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  UNSCHEDULED: "bg-slate-100 text-slate-600 border-slate-200",
  "ON HOLD": "bg-orange-50 text-orange-700 border-orange-200",
  IN_PROGRESS: "bg-violet-50 text-violet-700 border-violet-200",
  "PENDING PAYMENT": "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "PENDING PATIENT APPROVAL": "bg-sky-50 text-sky-700 border-sky-200",
  "PENDING THERAPIST ASSIGNMENT":
    "bg-orange-50 text-orange-700 border-orange-200",
};
