import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { previewTripBooking } from '@/lib/apis/bookingApi';
import { previewTransferBooking } from '@/lib/apis/transferApi';
import { isApiError } from '@/lib/apis/apiErrors';
import { storePendingBooking } from '@/lib/storage/pendingBookings';
import type { TransferBookingRequest } from '@/lib/types/bookingTypes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Prepare a booking for payment
 * This stores the booking data securely on the server
 * and returns a unique booking ID to use as the payment reference
 * Supports both trip and transfer bookings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received prepare booking request:', body);

    const bookingType = body.bookingType as 'trip' | 'transfer';

    if (!bookingType || (bookingType !== 'trip' && bookingType !== 'transfer')) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'bookingType must be either "trip" or "transfer"',
        },
        { status: 400 }
      );
    }

    if (bookingType === 'trip') {
      // Existing trip booking logic
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

      const bookingData = {
        tripSlotId: Number(tripSlotId),
        date: String(date),
        adults: Number(adults) || 0,
        children: Number(children) || 0,
        enfants: Number(enfants) || 0,
        extras: Array.isArray(extras) ? extras : [],
        promoCode: String(promoCode || ''),
      };

      console.log('Calling trip preview with booking data:', bookingData);
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

      const bookingId = randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const pendingBooking = {
        id: bookingId,
        bookingType: 'trip' as const,
        bookingData,
        expectedAmount: preview.data.total,
        expectedCurrency: preview.data.currency,
        createdAt: new Date(),
        expiresAt,
      };

      storePendingBooking(pendingBooking);

      return NextResponse.json({
        success: true,
        bookingId,
        preview: preview.data,
      });
    } else {
      // Transfer booking logic
      const { vehicleTypeId, legs, extras, promoCode } = body;

      if (!vehicleTypeId || !Array.isArray(legs) || legs.length === 0) {
        console.error('Validation failed: missing vehicleTypeId or legs', { vehicleTypeId, legs });
        return NextResponse.json(
          {
            error: 'Invalid request',
            message: 'vehicleTypeId and at least one leg are required',
          },
          { status: 400 }
        );
      }

      // Validate each leg has required fields
      for (const leg of legs) {
        if (!leg.fromRegionId || !leg.toRegionId || !leg.pickupDateTime) {
          return NextResponse.json(
            {
              error: 'Invalid request',
              message: 'Each leg must have fromRegionId, toRegionId, and pickupDateTime',
            },
            { status: 400 }
          );
        }
      }

      const bookingData: Omit<TransferBookingRequest, 'paymentMethod' | 'transactionId'> = {
        vehicleTypeId: Number(vehicleTypeId),
        legs: legs.map((leg: any) => ({
          fromRegionId: Number(leg.fromRegionId),
          toRegionId: Number(leg.toRegionId),
          pickupDateTime: String(leg.pickupDateTime),
        })),
        extras: Array.isArray(extras) ? extras : [],
        promoCode: String(promoCode || ''),
      };

      console.log('Calling transfer preview with booking data:', bookingData);
      const preview = await previewTransferBooking(bookingData);
      console.log('Preview response:', preview);

      if (!preview.succeeded || !preview.data) {
        console.error('Preview failed:', preview);
        return NextResponse.json(
          {
            error: 'Booking preview failed',
            message: preview.message || 'Failed to calculate transfer price',
          },
          { status: 400 }
        );
      }

      const bookingId = randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const pendingBooking = {
        id: bookingId,
        bookingType: 'transfer' as const,
        bookingData,
        expectedAmount: preview.data.total,
        expectedCurrency: preview.data.currency,
        createdAt: new Date(),
        expiresAt,
      };

      storePendingBooking(pendingBooking);

      return NextResponse.json({
        success: true,
        bookingId,
        preview: preview.data,
      });
    }

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
