'use client';

import { useEffect, useState } from 'react';

/**
 * Merender children HANYA setelah komponen ter-mount di sisi klien.
 * Sebelum mount, return null → tidak ada markup pada tahap SSR.
 */
export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Aktif begitu pertama kali dimount di browser
  useEffect(() => setMounted(true), []);

  return mounted ? <>{children}</> : null;
}