export interface IApiResponse<T> {
  StatusCode: number;
  Message: string;
  Result: T | null;
  Errors?: string[];
  Timestamp: string;
}

export interface IPaginationResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  sortColumn?: string;
  sortDirection?: string;
}
