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
  paymentMethod: "CreditCard" | "Cash";
  transactionId: string;
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

// ==============================
// Transfer booking request/response
// ==============================

export interface TransferLegRequest {
  fromRegionId: number;
  toRegionId: number;
  pickupDateTime: string; // ISO date string
}

export interface TransferBookingRequest {
  vehicleTypeId: number;
  legs: TransferLegRequest[];
  extras: ExtraItemRequest[];
  promoCode: string;
  paymentMethod: "CreditCard" | "Cash";
  transactionId: string;
}

export interface TransferLegResponse {
  fromRegionId: number;
  fromRegionName: string;
  toRegionId: number;
  toRegionName: string;
  pickupDateTime: string;
  price: number;
}

export interface TransferPreviewData {
  total: number;
  currency: string;
  discountValue: number;
  discount: PromoCodeDetails;
  extras: ExtraItemResponse[];
  transferTotal: number;
  extrasTotal: number;
  transferLegs: TransferLegResponse[];
}

export interface TransferBookingResponseDto {
  succeeded: boolean;
  message: string;
  data: TransferPreviewData;
}

// ==============================
// Region (by coordinates)
// ==============================

export interface RegionDto {
  id: number;
  title: string;
  geometry: string; // e.g. "polygon(nums)"
  isAirport: boolean;
}

export interface GetRegionByCoordinatesResponseDto {
  succeeded: boolean;
  message: string;
  data: RegionDto;
}

// ==============================
// Vehicle types
// ==============================

export interface VehicleTypeDto {
  id: number;
  title: string;
  capacity: number;
}

export interface GetVehicleTypesResponseDto {
  succeeded: boolean;
  message: string;
  data: {
    pageNumber: number;
    pageSize: number;
    count: number;
    data: VehicleTypeDto[];
  };
}
