import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string, fallback = "") => searchParams.get(key) ?? fallback;

  // Get all values for a key (used for multi-value params like status[])
  const getAll = (key: string): string[] => searchParams.getAll(key);

  const set = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        params.delete(k);
        if (v === null || v === "" || v === "all") return;
        if (Array.isArray(v)) {
          v.forEach((item) => params.append(k, item));
        } else {
          params.set(k, v);
        }
      });
      if (!("page" in updates)) params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const clear = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return { get, getAll, set, clear, searchParams };
}
