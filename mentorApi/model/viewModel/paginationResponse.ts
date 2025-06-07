export interface IPaginationResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  sortColumn?: string;
  sortDirection?: string;
}
