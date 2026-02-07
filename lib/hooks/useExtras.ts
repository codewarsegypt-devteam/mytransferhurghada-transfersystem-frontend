"use client";

import { useQuery } from "@tanstack/react-query";
import { getTripExtras } from "@/lib/apis/extras";

export const extrasKeys = {
  all: ["extras"] as const,
  byTrip: (tripId: number) => [...extrasKeys.all, tripId] as const,
};

/**
 * Fetches trip extras for a given trip id. Enabled only when tripId is defined.
 */
export function useTripExtras(tripId: number | undefined) {
  return useQuery({
    queryKey: extrasKeys.byTrip(tripId ?? 0),
    queryFn: () => getTripExtras(tripId!),
    enabled: typeof tripId === "number" && tripId > 0,
  });
}
