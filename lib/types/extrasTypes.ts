import type { ApiResponseDto } from "@/lib/types/tripsTypes";

// =============================================================================
// Trip extras API
// =============================================================================

export type ExtraChargeType = "PerBooking" | string;

export interface TripExtraPriceDto {
  amount: number;
  currency: string;
}

export interface TripExtraDto {
  id: number;
  title: string;
  description: string;
  extraChargeType: ExtraChargeType;
  price: TripExtraPriceDto;
  extraCategoryId: number;
}

export type TripExtrasResponseDto = ApiResponseDto<TripExtraDto[]>;
