import {
  buildPaymentUrl,
  generateKashierOrderHash,
  getConfig,
  type KashierPaymentOrder,
} from "@/lib/payment/kashier";
import { getPendingBooking } from "@/lib/storage/pendingBookings";
import { NextRequest, NextResponse } from "next/server";

// Configure route to handle body parsing properly
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
  try {
    const config = getConfig();

    // Validate configuration
    if (!config.mid || !config.PaymentApiKey || !config.baseUrl) {
      return NextResponse.json(
        {
          error: "Configuration error",
          message:
            "Missing required environment variables (MID, PAYMENT_API_KEY, BASE_URL)",
        },
        { status: 500 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

    // Get bookingId from request
    const { bookingId } = body;
    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "bookingId is required",
        },
        { status: 400 }
      );
    }

    // Retrieve the pending booking
    const pendingBooking = getPendingBooking(bookingId);
    console.log('pendingBooking', pendingBooking);
    if (!pendingBooking) {
      return NextResponse.json(
        {
          error: "Booking not found",
          message: "Booking has expired or does not exist. Please try booking again.",
        },
        { status: 404 }
      );
    }

    const { expectedAmount: amount, expectedCurrency: currency } = pendingBooking;

    // Build order object (secret used for hash only, not sent to Kashier)
    // Use bookingId as merchantOrderId for secure reference
    const order: KashierPaymentOrder & {
      secret: string;
      customerReference?: string;
    } = {
      amount: String(amount),
      currency: currency,
      merchantOrderId: bookingId, // Use the secure booking ID
      mid: config.mid,
      secret: config.PaymentApiKey,
      merchantRedirect: `${config.baseUrl}/payment/callback`,
      serverWebhook: `${config.baseUrl}/api/payment/webhook`,
      display: body.display || "en",
      failureRedirect: body.failureRedirect || "true",
      redirectMethod: body.redirectMethod || "get",
      allowedMethods: body.allowedMethods || "card, wallet, bank_installments",
      brandColor: body.brandColor || "rgba(163, 0, 0, 1)",
      hash: "", // set below after optional fields
    };

    if (body.customerReference) {
      order.customerReference = body.customerReference;
    }
    if (body.defaultMethod) {
      order.defaultMethod = body.defaultMethod;
    }
    if (body.connectedAccount) {
      order.connectedAccount = body.connectedAccount;
    }
    if (body.paymentRequestId) {
      order.paymentRequestId = body.paymentRequestId;
    }

    order.hash = generateKashierOrderHash(order);

    // Build payment URL
    const paymentUrl = buildPaymentUrl(order, config);

    // Log order details (without sensitive data)
    console.log("Payment order created:", {
      merchantId: order.mid,
      orderId: order.merchantOrderId,
      amount: order.amount,
      currency: order.currency,
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl,
      bookingId: bookingId,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
