import { useEffect, useState } from "react";

export function usePaginatedData<T>(
  fetchFn: (params?: Record<string, any>) => Promise<{
    data: T[];
    page: number;
    totalPages: number;
  }>,
  initialPageSize: number = 10,
  initialQuery: Record<string, any> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<Record<string, any>>(initialQuery);

  const load = async (pageNum: number = 1, overrideQuery?: Record<string, any>) => {
    setLoading(true);
    try {
      const combinedQuery = {
        ...query,
        ...overrideQuery,
        page: pageNum,
        pageLimit: initialPageSize,
      };
      const res = await fetchFn(combinedQuery);
      setData(res.data);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Pagination fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
  }, [page, query]);

  return {
    data,
    page,
    totalPages,
    loading,
    goNext: () => setPage((p) => Math.min(p + 1, totalPages)),
    goPrev: () => setPage((p) => Math.max(p - 1, 1)),
    setQuery,
    reload: () => load(page),
  };
}
