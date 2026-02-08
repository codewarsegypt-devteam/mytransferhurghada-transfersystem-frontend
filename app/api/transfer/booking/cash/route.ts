import { NextRequest, NextResponse } from 'next/server';
import { createTransferBooking } from '@/lib/apis/transferApi';
import { isApiError } from '@/lib/apis/apiErrors';
import type { TransferBookingRequest } from '@/lib/types/bookingTypes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Create a transfer booking with cash payment
 * This bypasses the prepare/payment flow and creates the booking directly
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received cash transfer booking request:', body);

    const { vehicleTypeId, legs, extras, promoCode } = body;

    // Validate required fields
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

    // Validate each leg
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

    const bookingData: TransferBookingRequest = {
      vehicleTypeId: Number(vehicleTypeId),
      legs: legs.map((leg: any) => ({
        fromRegionId: Number(leg.fromRegionId),
        toRegionId: Number(leg.toRegionId),
        pickupDateTime: String(leg.pickupDateTime),
      })),
      extras: Array.isArray(extras) ? extras : [],
      promoCode: String(promoCode || ''),
      paymentMethod: 'Cash',
      transactionId: '', // No transaction for cash
    };

    console.log('Creating cash transfer booking:', bookingData);

    // Create the booking directly
    const bookingResponse = await createTransferBooking(bookingData);

    console.log('Cash transfer booking created successfully:', bookingResponse);

    return NextResponse.json({
      success: true,
      bookingId: bookingResponse.message || 'Confirmed',
      message: 'Transfer booking created successfully. Please pay cash to the driver.',
    });

  } catch (error) {
    console.error('Error creating cash transfer booking:', error);
    
    if (isApiError(error)) {
      return NextResponse.json(
        {
          error: 'Booking creation failed',
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
