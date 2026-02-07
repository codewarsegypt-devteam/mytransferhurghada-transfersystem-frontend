import axios, { type AxiosRequestConfig } from "axios";
import { GET_TRIP_EXTRAS } from "@/paths";
import type { TripExtrasResponseDto } from "@/lib/types/extrasTypes";
import { ApiError, normalizeAndThrow } from "./apiErrors";

function assertSucceeded<T extends { succeeded?: boolean; message?: string }>(
  data: T
): asserts data is T & { succeeded: true } {
  if (data.succeeded === false) {
    throw new ApiError(
      data.message ?? "Request failed",
      undefined,
      "API_ERROR",
      data
    );
  }
}

/**
 * Fetches trip extras for a given trip. Compatible with React Query: returns data on success, throws on failure.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function getTripExtras(
  tripId: number
): Promise<TripExtrasResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: GET_TRIP_EXTRAS(tripId),
    };

    const { data } = await axios.request<TripExtrasResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    normalizeAndThrow(error);
  }
}
