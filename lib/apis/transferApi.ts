"use server";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import {
  PREVIEW_TRANSFER_BOOKING,
  CREATE_TRANSFER_BOOKING,
  GET_REGION_ID_BY_COORDINATES,
  GET_VEHICLE_TYPES,
  GET_EXTRAS,
} from "@/paths";
import type {
  TransferBookingRequest,
  TransferBookingResponseDto,
  GetRegionByCoordinatesResponseDto,
  GetVehicleTypesResponseDto,
  GetExtrasResponseDto,
  GetExtrasParams,
} from "@/lib/types/bookingTypes";
import { ApiError, normalizeAndThrow } from "./apiErrors";
import { getAuthCookie } from "@/lib/storage/authToken";

/**
 * Throws if the API response indicates failure (succeeded === false).
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
 * Preview transfer booking with pricing calculation.
 * Returns total price, transfer legs, extras breakdown, and applied discounts.
 * Does not send paymentMethod or transactionId.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function previewTransferBooking(
  bookingData: Omit<TransferBookingRequest, "paymentMethod" | "transactionId">
): Promise<TransferBookingResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: PREVIEW_TRANSFER_BOOKING,
      data: bookingData,
    };
    const { data } = await axios.request<TransferBookingResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    normalizeAndThrow(error);
  }
}

/**
 * Create a transfer booking.
 * Returns booking confirmation with final pricing details.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function createTransferBooking(
  bookingData: TransferBookingRequest
): Promise<TransferBookingResponseDto> {
  try {
    const tokenData = await getAuthCookie();
    const token = tokenData?.accessToken ?? null;

    const config: AxiosRequestConfig = {
      method: "POST",
      url: CREATE_TRANSFER_BOOKING,
      data: bookingData,
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    };
    const { data } = await axios.request<TransferBookingResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    normalizeAndThrow(error);
  }
}

/**
 * Get the region that contains the given coordinates.
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @returns Region (id, title, geometry, isAirport) for that location
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function getRegionByCoordinates(
  latitude: number,
  longitude: number
): Promise<GetRegionByCoordinatesResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: GET_REGION_ID_BY_COORDINATES,
      params: { latitude, longitude },
    };
    const { data } =
      await axios.request<GetRegionByCoordinatesResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    normalizeAndThrow(error);
  }
}

/**
 * Get all vehicle types (e.g. Sedan, Bus) with id, title, and capacity.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function getVehicleTypes(): Promise<GetVehicleTypesResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: GET_VEHICLE_TYPES,
      headers: {
        accept: "text/plain",
      },
    };
    const { data } = await axios.request<GetVehicleTypesResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    // console.log('getVehicleTypes error:', (error as AxiosError).response?.data);
    normalizeAndThrow(error);
  }
}

/**
 * Get extras (for transfer or booking). Optional filters: extraCategoryId, extraChargeType, pagination.
 * @throws {ApiError} On network error, non-2xx response, or when API returns succeeded: false
 */
export async function getExtras(
  params?: GetExtrasParams
): Promise<GetExtrasResponseDto> {
  try {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: GET_EXTRAS,
      params: params ?? {},
      headers: {
        accept: "text/plain",
      },
    };
    const { data } = await axios.request<GetExtrasResponseDto>(config);
    assertSucceeded(data);
    return data;
  } catch (error) {
    normalizeAndThrow(error);
  }
}
