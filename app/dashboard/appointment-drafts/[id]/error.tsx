'use client';

/* ------------------------------------------------------------------
 * Error UI – Tampil saat fetch detail draft gagal
 * ------------------------------------------------------------------ */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Draft detail error:', error); // log ke console dev

  return (
    <main className="container mx-auto max-w-4xl p-6 flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold text-red-600">
        Gagal memuat detail draft
      </h1>

      <p className="text-center text-sm text-gray-600">
        Terjadi kesalahan saat mengambil data. Periksa koneksi Anda atau coba
        muat ulang.
      </p>

      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400"
      >
        🔄 Muat Ulang
      </button>
    </main>
  );
}