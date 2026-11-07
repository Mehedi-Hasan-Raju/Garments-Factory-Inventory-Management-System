export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data: T | null;

