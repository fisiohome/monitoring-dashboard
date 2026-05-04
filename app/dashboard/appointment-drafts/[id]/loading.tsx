/* ------------------------------------------------------------------
 * Skeleton UI – Loading state for Draft Detail page
 * ------------------------------------------------------------------ */
export default function Loading() {
  return (
    <main className="container mx-auto max-w-4xl p-6 space-y-8 animate-pulse">
      {/* ===== Header Skeleton ===== */}
      <header className="flex items-center justify-between">
        {/* Judul halaman */}
        <div className="h-6 w-48 bg-gray-300 rounded" />
        {/* Badge status */}
        <div className="h-6 w-20 bg-gray-300 rounded" />
      </header>

      {/* ===== Section Skeletons ===== */}
      {[...Array(5)].map((_, i) => (
        <section key={i} className="space-y-4">
          {/* Judul section */}
          <div className="h-4 w-40 bg-gray-300 rounded" />
          {/* Tiga baris key-value */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-4/6 bg-gray-200 rounded" />
          </div>
        </section>
      ))}
    </main>
  );
}