import { useEffect, useState } from "react";

export function usePaginatedData<T>(
  fetchFn: (page?: number, pageLimit?: number) => Promise<{
    data: T[];
    page: number;
    totalPages: number;
  }>,
  initialPageSize: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetchFn(pageNum, initialPageSize);
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
  }, [page]);

  return {
    data,
    page,
    totalPages,
    loading,
    goNext: () => setPage((p) => Math.min(p + 1, totalPages)),
    goPrev: () => setPage((p) => Math.max(p - 1, 1)),
  };
}
