/* ------------------------------------------------------------------
 * Section – Wrapper berjudul untuk setiap kelompok informasi
 * Digunakan di halaman detail draft (& halaman lain bila perlu)
 * ------------------------------------------------------------------ */

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string; // opsional ekstra class
}

export default function Section({
  title,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={`space-y-3 ${className}`}>
      {/* Judul section */}
      <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
        {title}
      </h2>

      {/* Isi section */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-white dark:bg-gray-900/40">
        {children}
      </div>
    </section>
  );
}