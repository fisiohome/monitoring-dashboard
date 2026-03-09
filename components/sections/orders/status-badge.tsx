import { ORDER_STATUS_STYLES } from "./constants";

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ORDER_STATUS_STYLES[status] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}
    >
      {status?.replace(/_/g, " ") || "UNKNOWN"}
    </span>
  );
}
