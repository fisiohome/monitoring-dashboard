/* lib/fetcher.ts */
export async function fetcher<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  // Ambil base URL dari env; jika tidak ada, pakai string kosong
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  // Jika url sudah absolut (http/https) biarkan, jika relatif gabungkan dengan base
  const fullUrl = url.startsWith("http") ? url : `${base}${url}`;

  const res = await fetch(fullUrl, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      /* ignore, keep statusText */
    }
    throw new Error(`Fetch error ${res.status}: ${message}`);
  }

  return (await res.json()) as T;
}