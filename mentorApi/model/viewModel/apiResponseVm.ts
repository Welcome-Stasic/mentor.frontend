export default interface IApiResponse<T> {
  StatusCode: number;
  Message: string;
  Result: T | null;
  Errors?: string[];
  Timestamp: string;
}