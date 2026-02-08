"use server";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import { PREVIEW_TRIP_BOOKING, CREATE_TRIP_BOOKING } from "@/paths";
import type {
  TripBookingRequest,
  BookingPreviewResponseDto,
  CreateTripBookingResponseDto,
} from "@/lib/types/bookingTypes";
import { ApiError, normalizeAndThrow } from "./apiErrors";
import { getAuthCookie } from "@/lib/storage/authToken";

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
 * Preview trip booking with pricing calculation.
 * Returns total price, extras breakdown, and applied discounts.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function previewTripBooking(
  bookingData: Omit<TripBookingRequest, "paymentMethod" | "transactionId">
): Promise<BookingPreviewResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: PREVIEW_TRIP_BOOKING,
      data: bookingData,
    };
    console.log(bookingData) ;

    const { data } = await axios.request<BookingPreviewResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    console.log((error as AxiosError).response?.data);
    normalizeAndThrow(error);
  }
}

/**
 * Create a trip booking.
 * Returns booking confirmation with final pricing details.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function createTripBooking(
  bookingData: TripBookingRequest
): Promise<CreateTripBookingResponseDto> {


  try {
    const tokenData = await getAuthCookie();
    const token = tokenData?.accessToken ?? null;

    const config: AxiosRequestConfig = {
      method: "POST",
      url: CREATE_TRIP_BOOKING,
      data: bookingData,
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    };
    console.log(bookingData) ;

    const { data } = await axios.request<CreateTripBookingResponseDto>(config);
    console.log('createTripBooking response:', data);
    assertSucceeded(data);
    return data;
  } catch (error) {
    console.log('createTripBooking error:', (error as AxiosError).response?.data);
    normalizeAndThrow(error);
  }
}
