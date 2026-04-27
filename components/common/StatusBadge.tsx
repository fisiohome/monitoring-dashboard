/* ------------------------------------------------------------------
 * StatusBadge – Lencana warna-status untuk Appointment Draft
 * ------------------------------------------------------------------ */

import clsx from 'clsx';
import type { DraftStatus } from '@/types/appointment-draft';

interface StatusBadgeProps {
  status: DraftStatus;
  /** Tambahan kelas opsional jika perlu override styling */
  className?: string;
}

/* Peta warna Tailwind per status */
const colorMap: Record<DraftStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-300/20 dark:text-yellow-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-300/20 dark:text-blue-300',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-300/20 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-300/20 dark:text-red-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-300/20 dark:text-red-300',
  COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-300/20 dark:text-emerald-300',
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-200';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
        color,
        className,
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
}