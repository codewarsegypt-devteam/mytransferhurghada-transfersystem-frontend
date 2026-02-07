import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { previewTripBooking } from '@/lib/apis/bookingApi';
import { isApiError } from '@/lib/apis/apiErrors';
import { storePendingBooking } from '@/lib/storage/pendingBookings';
import type { TripBookingRequest } from '@/lib/types/bookingTypes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Prepare a booking for payment
 * This stores the booking data securely on the server
 * and returns a unique booking ID to use as the payment reference
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received prepare booking request:', body);

    // Validate required fields
    const { tripSlotId, date, adults, children, enfants, extras, promoCode } = body;
    
    if (!tripSlotId || !date) {
      console.error('Validation failed: missing tripSlotId or date', { tripSlotId, date });
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'tripSlotId and date are required',
        },
        { status: 400 }
      );
    }

    const bookingData: TripBookingRequest = {
      tripSlotId: Number(tripSlotId),
      date: String(date),
      adults: Number(adults) || 0,
      children: Number(children) || 0,
      enfants: Number(enfants) || 0,
      extras: Array.isArray(extras) ? extras : [],
      promoCode: String(promoCode || ''),
    };

    // Get the preview to verify pricing
    console.log('Calling preview with booking data:', bookingData);
    const preview = await previewTripBooking(bookingData);
    console.log('Preview response:', preview);

    if (!preview.succeeded || !preview.data) {
      console.error('Preview failed:', preview);
      return NextResponse.json(
        {
          error: 'Booking preview failed',
          message: preview.message || 'Failed to calculate booking price',
        },
        { status: 400 }
      );
    }

    // Generate a secure unique ID
    const bookingId = randomUUID();
    console.log('Generated booking ID:', bookingId);

    // Store the pending booking (expires in 1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const pendingBooking = {
      id: bookingId,
      bookingData,
      expectedAmount: preview.data.total,
      expectedCurrency: preview.data.currency,
      createdAt: new Date(),
      expiresAt,
    };

    console.log('Storing pending booking:', pendingBooking);
    storePendingBooking(pendingBooking);

    console.log('Pending booking stored successfully:', {
      id: bookingId,
      amount: preview.data.total,
      currency: preview.data.currency,
      tripSlotId: bookingData.tripSlotId,
      date: bookingData.date,
    });

    const response = {
      success: true,
      bookingId,
      preview: preview.data,
    };
    console.log('Returning response:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error preparing booking:', error);
    
    if (isApiError(error)) {
      return NextResponse.json(
        {
          error: 'Booking preview failed',
          message: error.message,
        },
        { status: error.statusCode || 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
