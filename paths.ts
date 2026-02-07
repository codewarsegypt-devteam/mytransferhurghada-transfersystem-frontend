
export const BASE = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// Trip API
// ==============================

// Public
export const GET_PUBLIC_TRIPS = `${BASE}/api/Trip/public`;
export const GET_PUBLIC_TRIP_BY_SLUG = (slug: string) =>
  `${BASE}/api/Trip/public/${slug}`;


// ==============================
// trip booking API
// ==============================
export const PREVIEW_TRIP_BOOKING = `${BASE}/api/Booking/previewTripBooking`;
export const CREATE_TRIP_BOOKING = `${BASE}/api/Booking/bookTrip`;

// ==============================
// extras API
// ==============================
export const GET_TRIP_EXTRAS = (tripId: number) => `${BASE}/api/Trip/public/${tripId}/extras`;

// ==============================
// User Login API
// ==============================
export const USER_LOGIN = `${BASE}/api/Auth/google-login`;
