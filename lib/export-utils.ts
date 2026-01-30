
/**
 * Helper to fetch all data by paginating through all available pages.
 * 
 * @param fetcher - The API function to call (e.g. fetchAppointments)
 * @param params - The base parameters (filters, etc). 'page' and 'page_size' will be overridden.
 * @param dataKey - The key where the array is stored in the response (e.g. 'appointments', 'bookings')
 * @returns Promise<any[]> - The complete array of all items
 */
export async function fetchAllPages(
    fetcher: (params: any) => Promise<any>,
    params: any,
    dataKey: string
): Promise<any[]> {
    const PAGE_SIZE = 50; // Use a safe page size that the API likely supports
    let allData: any[] = [];

    // 1. Fetch first page to get metadata
    const firstParams = { ...params, page: 1, page_size: PAGE_SIZE };
    const firstRes = await fetcher(firstParams);

    const list = firstRes.data?.[dataKey] || firstRes[dataKey] || (Array.isArray(firstRes) ? firstRes : []);
    allData = [...list];

    const meta = firstRes.meta || firstRes.data?.meta;

    // Determine the actual page size used by the server
    // Some APIs return 'limit' or 'per_page' to indicate the page size they actually used.
    const serverLimit = meta?.limit || meta?.per_page || meta?.pageSize;
    const effectivePageSize = serverLimit ? Number(serverLimit) : PAGE_SIZE;

    let totalPages = meta?.total_pages;

    if (!totalPages) {
        const totalItems = meta?.total || meta?.total_items || firstRes.total || 0;
        if (totalItems > 0) {
            totalPages = Math.ceil(totalItems / effectivePageSize);
        } else {
            totalPages = 1;
        }
    }

    console.log(`Exporting ${dataKey}: Found ${meta?.total || list.length} items. Server limit: ${effectivePageSize}. Calculated total pages: ${totalPages}`);

    if (totalPages <= 1) {
        console.log("Only 1 page found or totalPages is 0/1. Returning ", allData.length, " items.");
        return allData;
    }

    // 2. Generate promises for remaining pages
    const promises = [];
    for (let p = 2; p <= totalPages; p++) {
        console.log(`Queueing fetch for page ${p}`);
        promises.push(fetcher({ ...params, page: p, page_size: PAGE_SIZE }));
    }

    // 3. Run in parallel
    // Note: If totalPages is huge, we might want to batch this to avoid rate limits, 
    // but for now Promise.all is usually fine for < 100 pages.
    try {
        const responses = await Promise.all(promises);
        console.log(`Received ${responses.length} responses from parallel fetch.`);

        responses.forEach((res, index) => {
            const pageList = res.data?.[dataKey] || res[dataKey] || (Array.isArray(res) ? res : []);
            console.log(`Page ${index + 2} returned ${pageList.length} items.`);
            allData = [...allData, ...pageList];
        });
    } catch (error) {
        console.error("Error fetching remaining pages", error);
        throw error; // Re-throw to make it visible
    }

    console.log(`Total items collected: ${allData.length}`);
    return allData;
}
