import axios, { type AxiosRequestConfig } from "axios";
import { GET_PUBLIC_TRIPS, GET_PUBLIC_TRIP_BY_SLUG } from "@/paths";
import type {
  GetPublicTripsParams,
  PublicTripsResponseDto,
  PublicTripBySlugResponseDto,
} from "@/lib/types/tripsTypes";
import { ApiError, normalizeAndThrow } from "./apiErrors";

/**
 * Throws if the API response indicates failure (succeeded === false).
 * React Query expects query functions to throw on error so it can set isError/error.
 */
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
 * Fetches public trips. Compatible with React Query: returns data on success, throws on failure.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function getPublicTrips(
  params?: GetPublicTripsParams
): Promise<PublicTripsResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: GET_PUBLIC_TRIPS,
      params: params ?? {},
    };

    const { data } = await axios.request<PublicTripsResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    normalizeAndThrow(error);
  }
}

/**
 * Fetches a single public trip by slug. Compatible with React Query: returns data on success, throws on failure.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function getPublicTripBySlug(
  slug: string
): Promise<PublicTripBySlugResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: GET_PUBLIC_TRIP_BY_SLUG(slug),
    };

    const { data } = await axios.request<PublicTripBySlugResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    normalizeAndThrow(error);
  }
}
