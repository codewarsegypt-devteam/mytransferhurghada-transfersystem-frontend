import { getConfig, validateSignature } from "@/lib/payment/kashier";
import { NextRequest, NextResponse } from "next/server";

// /**
//  * GET /api/payment/callback
//  * Handles payment callback redirects from Kashier (GET method)
//  */
export async function GET(request: NextRequest) {
  try {
    const config = getConfig();

    if (!config.PaymentApiKey) {
      return new NextResponse("Configuration error: Missing PaymentApiKey", {
        status: 500,
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    console.log("Callback received (GET):", query);

    // Validate signature if present
    if (query.signature) {
      const isValid = validateSignature(query, config.PaymentApiKey);
      if (!isValid) {
        console.error("Invalid signature in callback");
        const homeUrl =
          process.env.NEXT_PUBLIC_BASE_URL || config.baseUrl || "/";
        return new NextResponse(
          `<!DOCTYPE html>
                    <html>
                        <head>
                            <title>Payment Verification Failed</title>
                            <meta http-equiv="refresh" content="3;url=${homeUrl}" />
                        </head>
                        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                            <h1 style="color: #dc3545;">Payment Verification Failed</h1>
                            <p>Invalid payment signature. Please contact support.</p>
                            <p style="font-size: 14px; color: #666;">Redirecting in 3 seconds...</p>
                            <a href="${homeUrl}/home" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Return to Home</a>
                        </body>
                    </html>`,
          {
            status: 400,
            headers: { "Content-Type": "text/html" },
          }
        );
      }
    }

    // Extract payment information
    const paymentStatus = query.paymentStatus;
    const merchantOrderId = query.merchantOrderId;
    const orderId = query.orderId;
    const transactionId = query.transactionId;
    const amount = query.amount;
    const currency = query.currency;
    const signature = query.signature;
    const cardDataToken = query.cardDataToken;
    const maskedCard = query.maskedCard;
    const cardBrand = query.cardBrand;
    const orderReference = query.orderReference;
    const mode = query.mode;

    const homeUrl = (
      process.env.NEXT_PUBLIC_BASE_URL ||
      config.baseUrl ||
      ""
    ).replace(/\/$/, "");
    // Fix: Redirect to the correct path /home/payment/callback (not /payment/callback)
    const params = new URLSearchParams();

    // Preserve original Kashier parameter names for signature verification FIRST
    // This ensures the verify endpoint can reconstruct the exact query
    // paymentStatus is critical for signature validation - preserve original value
    if (paymentStatus) params.append("paymentStatus", paymentStatus);
    if (merchantOrderId) params.append("merchantOrderId", merchantOrderId);
    if (orderId) params.append("orderId", orderId);
    if (transactionId) params.append("transactionId", transactionId);
    if (amount) params.append("amount", amount);
    if (currency) params.append("currency", currency);
    if (signature) params.append("signature", signature);
    if (cardDataToken) params.append("cardDataToken", cardDataToken);
    if (maskedCard) params.append("maskedCard", maskedCard);
    if (cardBrand) params.append("cardBrand", cardBrand);
    if (orderReference) params.append("orderReference", orderReference);
    if (mode) params.append("mode", mode);

    // paymentStatus
    // cardDataToken
    // maskedCard
    // merchantOrderId
    // orderId
    // cardBrand
    // transactionId
    // currency
    // signature
    // mode

    const redirectUrl = `${homeUrl}/payment/callback?${params.toString()}`;

    // Redirect to frontend callback page
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error processing callback:", error);
    const homeUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    // Redirect to home page with error parameter
    return NextResponse.redirect(
      `${homeUrl}/payment/callback?error=callback_error`
    );
  }
}

/**
 * POST /api/payment/callback
 * Handles payment callback redirects from Kashier (POST method)
 */
export async function POST(request: NextRequest) {
  try {
    const config = getConfig();

    if (!config.PaymentApiKey) {
      return NextResponse.json(
        { error: "Configuration error", message: "Missing PaymentApiKey" },
        { status: 500 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing POST callback body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body", message: "Failed to parse JSON" },
        { status: 400 }
      );
    }

    console.log("Callback received (POST):", body);

    // Validate signature if present
    if (body.signature) {
      const isValid = validateSignature(body, config.PaymentApiKey);
      if (!isValid) {
        console.error("Invalid signature in callback");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }
    }

    // Extract payment information
    const paymentStatus = body.paymentStatus?.toLowerCase();
    const merchantOrderId = body.merchantOrderId;
    const transactionId = body.transactionId || body.orderId;

    // Handle different payment statuses
    if (paymentStatus === "success") {
      console.log(
        `Payment SUCCESS - Order: ${merchantOrderId}, Transaction: ${transactionId}`
      );
      // TODO: Update your database/order status to 'paid' here

      return NextResponse.json({
        status: "success",
        message: "Payment processed successfully",
        orderId: merchantOrderId,
        transactionId: transactionId,
      });
    } else if (paymentStatus === "failed" || paymentStatus === "rejected") {
      console.log(`Payment FAILED - Order: ${merchantOrderId}`);
      // TODO: Update your database/order status to 'failed' here

      return NextResponse.json({
        status: "failed",
        message: "Payment failed",
        orderId: merchantOrderId,
      });
    } else if (paymentStatus === "pending") {
      console.log(`Payment PENDING - Order: ${merchantOrderId}`);
      // TODO: Update your database/order status to 'pending' here

      return NextResponse.json({
        status: "pending",
        message: "Payment is pending",
        orderId: merchantOrderId,
      });
    } else {
      return NextResponse.json({
        status: "unknown",
        message: "Unknown payment status",
        orderId: merchantOrderId,
      });
    }
  } catch (error: unknown) {
    console.error("Error processing callback:", error);
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
