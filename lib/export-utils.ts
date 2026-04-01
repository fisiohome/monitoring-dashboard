/**
 * Helper to fetch all data by paginating through all available pages.
 *
 * @param fetcher - The API function to call (e.g. fetchAppointments)
 * @param params - The base parameters (filters, etc). 'page' and 'limit' will be overridden.
 * @param dataKey - The key where the array is stored in the response (e.g. 'appointments', 'bookings')
 * @returns Promise<any[]> - The complete array of all items
 */
export async function fetchAllPages(
  fetcher: (params: any) => Promise<any>,
  params: any,
  dataKey: string,
  onProgress?: (loaded: number, total: number) => void,
): Promise<any[]> {
  const LIMIT = 500; // Reduced limit for safety
  let allData: any[] = [];

  // 1. Fetch first page to get metadata
  const firstParams = { ...params, page: 1, limit: LIMIT };
  const firstRes = await fetcher(firstParams);

  const list =
    firstRes.data?.[dataKey] ||
    firstRes[dataKey] ||
    (Array.isArray(firstRes) ? firstRes : []);
  allData = [...list];

  const meta = firstRes.meta || firstRes.data?.meta;

  const serverLimit = meta?.limit || meta?.per_page;
  const effectiveLimit = serverLimit ? Number(serverLimit) : LIMIT;

  let totalPages = meta?.total_pages;

  if (!totalPages) {
    const totalItems = meta?.total || meta?.total_items || firstRes.total || 0;
    if (totalItems > 0) {
      totalPages = Math.ceil(totalItems / effectiveLimit);
    } else {
      totalPages = 1;
    }
  }

  console.log(
    `Exporting ${dataKey}: Found ${meta?.total || list.length} items. Server limit: ${effectiveLimit}. Calculated total pages: ${totalPages}`,
  );

  // Trigger initial progress
  if (onProgress) {
    onProgress(1, totalPages);
  }

  if (totalPages <= 1) {
    return allData;
  }

  // 2. Fetch remaining pages in small chunks to avoid server overload
  const CONCURRENCY = 3;

  for (let i = 2; i <= totalPages; i += CONCURRENCY) {
    const batch = [];
    for (let j = 0; j < CONCURRENCY && i + j <= totalPages; j++) {
      const p = i + j;
      batch.push(fetcher({ ...params, page: p, limit: LIMIT }));
    }

    try {
      const responses = await Promise.all(batch);

      responses.forEach((res) => {
        const pageList =
          res.data?.[dataKey] ||
          res[dataKey] ||
          (Array.isArray(res) ? res : []);
        allData = [...allData, ...pageList];
      });

      if (onProgress) {
        onProgress(Math.min(i + CONCURRENCY - 1, totalPages), totalPages);
      }
    } catch (error) {
      console.error("Error fetching chunk of pages:", error);
      throw new Error(
        `Gagal mengambil sebagian data export. Silakan coba lagi. (${error})`,
      );
    }
  }

  console.log(`Total items collected: ${allData.length}`);
  return allData;
}
