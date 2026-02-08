/**
 * Server-side storage for pending bookings
 * In production, this should be replaced with Redis or a database table
 */

import type { TripBookingRequest, TransferBookingRequest } from '@/lib/types/bookingTypes';

export type BookingType = 'trip' | 'transfer';

export interface PendingTripBooking {
  id: string;
  bookingType: 'trip';
  bookingData: Omit<TripBookingRequest, 'paymentMethod' | 'transactionId'>;
  expectedAmount: number;
  expectedCurrency: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface PendingTransferBooking {
  id: string;
  bookingType: 'transfer';
  bookingData: Omit<TransferBookingRequest, 'paymentMethod' | 'transactionId'>;
  expectedAmount: number;
  expectedCurrency: string;
  createdAt: Date;
  expiresAt: Date;
}

export type PendingBooking = PendingTripBooking | PendingTransferBooking;

// In-memory storage (for development)
// Attach to globalThis so the same Map is shared across all API routes in the same Node process.
// Without this, /api/booking/prepare and /api/payment/create can run with different module instances
// and get different Maps, so the payment route would never see the stored booking.
const globalForPendingBookings = globalThis as unknown as {
  __pendingBookings?: Map<string, PendingBooking>;
};
const pendingBookings =
  globalForPendingBookings.__pendingBookings ?? new Map<string, PendingBooking>();
if (!globalForPendingBookings.__pendingBookings) {
  globalForPendingBookings.__pendingBookings = pendingBookings;
}

// Clean up expired bookings every 5 minutes
setInterval(() => {
  const now = new Date();
  for (const [id, booking] of pendingBookings.entries()) {
    if (booking.expiresAt < now) {
      pendingBookings.delete(id);
    }
  }
}, 5 * 60 * 1000);

/**
 * Store a pending booking
 * @param booking - The pending booking data
 * @returns The stored booking
 */
export function storePendingBooking(booking: PendingBooking): PendingBooking {
  console.log('[Storage] Storing pending booking:', {
    id: booking.id,
    amount: booking.expectedAmount,
    currency: booking.expectedCurrency,
    expiresAt: booking.expiresAt,
  });
  pendingBookings.set(booking.id, booking);
  console.log('[Storage] Current pending bookings count:', pendingBookings.size);
  console.log('[Storage] Stored booking successfully');
  return booking;
}

/**
 * Retrieve a pending booking by ID
 * @param id - The booking ID
 * @returns The pending booking or null if not found/expired
 */
export function getPendingBooking(id: string): PendingBooking | null {
  const booking = pendingBookings.get(id);
  
  if (!booking) {
    return null;
  }

  // Check if expired
  if (booking.expiresAt < new Date()) {
    pendingBookings.delete(id);
    return null;
  }

  return booking;
}

/**
 * Delete a pending booking by ID
 * @param id - The booking ID
 */
export function deletePendingBooking(id: string): void {
  pendingBookings.delete(id);
}

/**
 * Validate that the payment amount matches the expected amount
 * @param booking - The pending booking
 * @param paidAmount - The amount paid
 * @param paidCurrency - The currency paid
 * @returns true if valid, false otherwise
 */
export function validatePaymentAmount(
  booking: PendingBooking,
  paidAmount: number,
  paidCurrency: string
): boolean {
  // Allow small floating point differences (1 cent)
  const difference = Math.abs(booking.expectedAmount - paidAmount);
  const currencyMatches = booking.expectedCurrency === paidCurrency;
  
  return currencyMatches && difference < 0.01;
}
