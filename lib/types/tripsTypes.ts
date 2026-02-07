// =============================================================================
// Helpers
// =============================================================================

export interface ApiResponseDto<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

// =============================================================================
// Enums & Unions
// =============================================================================

export type TripType = "InsideCity" | "CityToCity";

export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type DiscountType = "FixedAmount" | string;

// =============================================================================
// Responses
// =============================================================================

export type TripListDataDto = {
  pageNumber: number;
  pageSize: number;
  count: number;
  data: TripItemDto[];
};

export type PublicTripsResponseDto = ApiResponseDto<TripListDataDto>;

export type PublicTripBySlugResponseDto = ApiResponseDto<PublicTripDto>;

// =============================================================================
// Params
// =============================================================================

export interface GetPublicTripsParams {
  CategoryId?: number;
  City?: string;
  TripType?: TripType;
  HasDiscount?: boolean;
  MinPrice?: number;
  MaxPrice?: number;
  PageNumber?: number;
  PageSize?: number;
  Search?: string;
  Sort?: string;
  IsDeleted?: boolean;
}

// =============================================================================
// DTOs (API)
// =============================================================================

export interface CurrencyDto {
  currencyCode: string;
}

export interface PriceDto {
  adult: number;
  child: number;
  enfant: number;
  currency: CurrencyDto;
}

export interface DiscountDto {
  type: DiscountType;
  value: number;
  start: string;
  end: string;
}

/** Discount for single trip (uses amount instead of value) */
export interface TripDiscountDto {
  amount: number;
  type: DiscountType;
  start: string;
  end: string;
}

export interface TripImageDto {
  id: number;
  imageURL: string;
  isCoverImage: boolean;
}

export interface TripHighlightDto {
  id: number;
  name: string;
}

export interface TripInclusionDto {
  id: number;
  name: string;
}

export interface TripExclusionDto {
  id: number;
  name: string;
}

export interface TripLanguageDto {
  id: number;
  name: string;
}

export interface TripSlotDto {
  id: number;
  tripId: number;
  day: DayOfWeek;
  startsAt: string;
  capacity: number;
}

export interface InfoSectionItemDto {
  id: number;
  title: string;
}

export interface InfoSectionDto {
  id: number;
  title: string;
  items: InfoSectionItemDto[];
}

// =============================================================================
// Core (shared base & composed DTOs)
// =============================================================================

export interface TripBaseDto {
  id: number;
  title: string;
  slug: string;
  city: string;
  price: PriceDto;
  durationHours: string;
}

export type TripItemDto = TripBaseDto & {
  category: string;
  coverImageURL: string;
  discount?: DiscountDto;
};

export interface PublicTripDto extends TripBaseDto {
  description: string;
  overview: string;
  tripType: TripType;
  discount?: TripDiscountDto;
  bookingWindowHours: number;
  categoryId: number;
  categoryName: string;
  images: TripImageDto[];
  highlights: TripHighlightDto[];
  inclusions: TripInclusionDto[];
  exclusions: TripExclusionDto[];
  languages: TripLanguageDto[];
  tripSlots: TripSlotDto[];
  infoSections: InfoSectionDto[];
}
