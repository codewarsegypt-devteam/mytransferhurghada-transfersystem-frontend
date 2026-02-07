"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPublicTrips,
  getPublicTripBySlug,
} from "@/lib/apis/tripsApi";
import type { GetPublicTripsParams } from "@/lib/types/tripsTypes";
import { isApiError } from "@/lib/apis/apiErrors";

/** Query key factory for trips (useful for invalidation and refetch). */
export const tripsKeys = {
  all: ["trips"] as const,
  lists: () => [...tripsKeys.all, "list"] as const,
  list: (params?: GetPublicTripsParams) =>
    [...tripsKeys.lists(), params ?? {}] as const,
  details: () => [...tripsKeys.all, "detail"] as const,
  detail: (slug: string) => [...tripsKeys.details(), slug] as const,
};

/**
 * Fetches public trips. Uses the API function that throws on error (React Query compatible).
 * Error is typed as ApiError when isApiError(error) is true.
 */
export function usePublicTrips(params?: GetPublicTripsParams) {
  return useQuery({
    queryKey: tripsKeys.list(params),
    queryFn: () => getPublicTrips(params),
  });
}

/**
 * Fetches a single public trip by slug. Uses the API function that throws on error (React Query compatible).
 * Error is typed as ApiError when isApiError(error) is true.
 */
export function usePublicTripBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: tripsKeys.detail(slug),
    queryFn: () => getPublicTripBySlug(slug),
    enabled: enabled && !!slug,
  });
}

export { isApiError };
