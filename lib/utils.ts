import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateFilter(dateStr: string, isEnd: boolean = false): string {
  if (!dateStr) return "";
  if (dateStr.includes("T")) {
    if (dateStr.length === 16) {
      // Convert datetime-local format (YYYY-MM-DDTHH:mm) to RFC3339
      return `${dateStr}:00+07:00`;
    }
    return dateStr;
  }
  return `${dateStr}T${isEnd ? "23:59:59" : "00:00:00"}+07:00`;
}
