import type { AxiosError } from "axios";

/**
 * Normalized API error for consistent handling in React Query and UI.
 * React Query will set `isError: true` and `error` to this when the query function throws.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
    public readonly responseData?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Type guard for ApiError (useful in error boundaries and query error handling).
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Normalizes unknown errors (e.g. AxiosError) into ApiError and rethrows.
 * Use in API functions so React Query receives a consistent error shape.
 */
export function normalizeAndThrow(error: unknown): never {
  if (error instanceof ApiError) {
    throw error;
  }

  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosError = error as AxiosError<{ message?: string; succeeded?: boolean, details?: string }>;
    console.log(axiosError.response?.data);
    const message =
      axiosError.response?.data?.details ??
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Request failed";
    const statusCode = axiosError.response?.status;
    throw new ApiError(
      message,
      statusCode,
      axiosError.code,
      axiosError.response?.data
    );
  }

  if (error instanceof Error) {
    throw new ApiError(error.message);
  }

  throw new ApiError(String(error));
}
