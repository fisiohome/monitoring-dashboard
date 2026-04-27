/* ------------------------------------------------------------------
 * KeyValue – Baris “Label : Value” yang rapi & reusable
 * ------------------------------------------------------------------ */

import React from 'react';
import clsx from 'clsx';

interface KeyValueProps {
  /** Teks label di sisi kiri */
  label: string;
  /** Konten nilai di sisi kanan (string atau elemen) */
  value: React.ReactNode;
  /**
   * Bila true, label & value ditumpuk vertikal pada device sempit (mobile-first).
   * Default: false (horizontal dengan flex).
   */
  stacked?: boolean;
  /** ClassName tambahan */
  className?: string;
}

export default function KeyValue({
  label,
  value,
  stacked = false,
  className = '',
}: KeyValueProps) {
  return (
    <div
      className={clsx(
        'flex',
        stacked ? 'flex-col gap-1' : 'flex-row justify-between',
        className,
      )}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
        {value}
      </span>
    </div>
  );
}