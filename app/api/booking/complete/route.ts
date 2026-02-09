import { NextRequest, NextResponse } from 'next/server';
import { createTripBooking } from '@/lib/apis/bookingApi';
import { createTransferBooking } from '@/lib/apis/transferApi';
import { isApiError } from '@/lib/apis/apiErrors';
import {
  getPendingBooking,
  deletePendingBooking,
  validatePaymentAmount,
} from '@/lib/storage/pendingBookings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Complete a booking after successful payment
 * This validates the payment amount and creates the actual booking
 * Supports both trip and transfer bookings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { bookingId, transactionId, paidAmount, paidCurrency } = body;

    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'bookingId is required',
        },
        { status: 400 }
      );
    }

    // Retrieve the pending booking
    const pendingBooking = getPendingBooking(bookingId);

    if (!pendingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found',
          message: 'Booking has expired or does not exist. Please contact support with your transaction ID.',
        },
        { status: 404 }
      );
    }

    // Validate payment amount matches expected amount
    const amountValid = validatePaymentAmount(
      pendingBooking,
      parseFloat(paidAmount),
      paidCurrency
    );

    if (!amountValid) {
      console.error('Payment amount mismatch:', {
        bookingId,
        expected: {
          amount: pendingBooking.expectedAmount,
          currency: pendingBooking.expectedCurrency,
        },
        received: {
          amount: paidAmount,
          currency: paidCurrency,
        },
      });

      // Don't delete the booking yet - admin can review manually
      return NextResponse.json(
        {
          success: false,
          error: 'Payment amount mismatch',
          message: 'The payment amount does not match the booking total. Please contact support.',
        },
        { status: 400 }
      );
    }

    // Create the actual booking based on type
    try {
      if (pendingBooking.bookingType === 'trip') {
        const bookingResponse = await createTripBooking({
          ...pendingBooking.bookingData,
          paymentMethod: 'CreditCard',
          transactionId: transactionId || '',
        });

        // Delete the pending booking after successful creation
        deletePendingBooking(bookingId);

        console.log('Trip booking completed successfully:', {
          pendingBookingId: bookingId,
          actualBookingId: bookingResponse.data,
          transactionId,
          amount: paidAmount,
          currency: paidCurrency,
        });

        return NextResponse.json({
          success: true,
          bookingId: bookingResponse.data,
          bookingType: 'trip',
          message: 'Booking created successfully',
        });
      } else {
        // Transfer booking
        const bookingResponse = await createTransferBooking({
          ...pendingBooking.bookingData,
          paymentMethod: 'CreditCard',
          transactionId: transactionId || '',
        });

        // Delete the pending booking after successful creation
        deletePendingBooking(bookingId);

        console.log('Transfer booking completed successfully:', {
          pendingBookingId: bookingId,
          responseMessage: bookingResponse.message,
          transactionId,
          amount: paidAmount,
          currency: paidCurrency,
        });

        return NextResponse.json({
          success: true,
          // bookingId: bookingId,
          bookingId: bookingResponse.data,
          bookingType: 'transfer',
          message: 'Transfer booking created successfully',
        });
      }

    } catch (bookingError) {
      console.error('Error creating booking:', bookingError);

      // Don't delete the pending booking - we can retry
      if (isApiError(bookingError)) {
        const responseData = bookingError.responseData as { detail?: string } | undefined;
        const isUserNotFound =
          bookingError.statusCode === 404 &&
          (bookingError.message?.includes('Resource not found') ||
            responseData?.detail?.toLowerCase().includes('user not found'));

        if (isUserNotFound) {
          return NextResponse.json(
            {
              success: false,
              error: 'Login required',
              code: 'USER_REQUIRED',
              message:
                'You must be logged in to complete a transfer booking. Please log in and try again.',
            },
            { status: 401 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: 'Booking creation failed',
            message: bookingError.message,
          },
          { status: bookingError.statusCode || 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Booking creation failed',
          message: bookingError instanceof Error ? bookingError.message : 'Unknown error occurred',
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error completing booking:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
