/**
 * Booking API Types
 * Used for trip booking preview and creation
 */

// ==============================
// Request Types
// ==============================

export interface ExtraItemRequest {
  extraId: number;
  quantity: number;
}

export interface TripBookingRequest {
  tripSlotId: number;
  date: string; // Format: "YYYY-MM-DD"
  adults: number;
  children: number;
  enfants: number;
  extras: ExtraItemRequest[];
  promoCode: string;
}

// ==============================
// Response Types
// ==============================

export type DiscountType = "FixedAmount" | "Percentage";

export interface DiscountDetails {
  type: DiscountType;
  value: number;
  start: string; // ISO date string
  end: string; // ISO date string
}

export interface PromoCodeDetails {
  promoCodeId: number;
  promoCode: string;
  discount: DiscountDetails;
}

export type ExtraChargeType = "PerBooking" | "PerPerson";

export interface ExtraItemResponse {
  extraId: number;
  title: string;
  quantity: number;
  extraChargeType: ExtraChargeType;
  totalPrice: number;
}

export interface BookingPreviewData {
  total: number;
  currency: string;
  discountValue: number;
  discount: PromoCodeDetails;
  extras: ExtraItemResponse[];
  tripPriceAdult: number;
  tripPriceChild: number;
  tripPriceEnfant: number;
  tripTotal: number;
  extrasTotal: number;
}

export interface BookingPreviewResponseDto {
  succeeded: boolean;
  message: string;
  data: BookingPreviewData;
}

// createTripBooking uses the same response structure as preview
export type CreateTripBookingResponseDto = {
  succeeded: boolean;
  message: string;
  data: number;
};
