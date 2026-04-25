import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  initialPageSize?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  paginatedData: T[];
  startIndex: number;
  endIndex: number;
  totalItems: number;
  handlePageChange: (page: number, size: number) => void;
  resetPagination: () => void;
}

function usePagination<T>({ 
  data, 
  initialPageSize = 10 
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize,
    paginatedData,
    startIndex,
    endIndex,
    totalItems: data.length,
    handlePageChange,
    resetPagination
  };
}

export default usePagination;
