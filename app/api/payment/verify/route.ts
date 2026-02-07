import { getConfig, validateSignature } from "@/lib/payment/kashier";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for payment verification request
const PaymentVerifySchema = z.object({
  paymentStatus: z.enum(["SUCCESS", "FAILURE"], {
    message: "Payment status is required and must be SUCCESS or FAILURE",
  }),
  signature: z
    .string()
    .min(1, "Payment signature is required for verification"),
  orderId: z.string().optional(),
  transactionId: z.string().optional(),
  amount: z.string().optional(),
  currency: z.string().optional(),
  merchantOrderId: z.string().optional(),
  cardDataToken: z.string().optional(),
  maskedCard: z.string().optional(),
  cardBrand: z.string().optional(),
  orderReference: z.string().optional(),
  mode: z.string().optional(),
});

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
      console.error("Error parsing verify request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body", message: "Failed to parse JSON" },
        { status: 400 }
      );
    }

    // Validate request body with Zod
    const validationResult = PaymentVerifySchema.safeParse(body);

    if (!validationResult.success) {
      console.error(
        "Payment verification validation failed:",
        validationResult.error.issues
      );
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        {
          error: "Validation error",
          message: firstError.message,
          verified: false,
        },
        { status: 400 }
      );
    }

    const {
      paymentStatus, // Original Kashier parameter name (required for signature validation)
      orderId,
      transactionId,
      amount,
      currency,
      signature,
      merchantOrderId,
      cardDataToken,
      maskedCard,
      cardBrand,
      orderReference,
      mode,
    } = validationResult.data;

    // CRITICAL: Build query object for signature validation using EXACT parameter names from Kashier
    // The signature was created by Kashier using specific parameter names
    // We need to reconstruct the original Kashier parameters exactly as they were sent
    // IMPORTANT: Parameter order matters for signature validation - match the order from callback
    const queryForValidation: Record<string, string> = {};

    // Kashier uses 'paymentStatus' in the signature, not 'status'
    // This is CRITICAL - the signature was created with paymentStatus, not status
    if (paymentStatus) queryForValidation.paymentStatus = paymentStatus;

    // Add parameters in the order that matches typical Kashier callback order
    // This ensures the query string is built in the same order as the original signature
    if (cardDataToken) queryForValidation.cardDataToken = cardDataToken;
    if (maskedCard) queryForValidation.maskedCard = maskedCard;

    // CRITICAL: Include ALL parameters that Kashier sent in the callback
    // The signature was created with ALL parameters present in the callback
    // We must include exactly the same parameters that were used to create the signature
    // Kashier may send both merchantOrderId AND orderId - include both if present
    if (merchantOrderId) queryForValidation.merchantOrderId = merchantOrderId;
    if (orderId) queryForValidation.orderId = orderId;

    if (cardBrand) queryForValidation.cardBrand = cardBrand;
    if (orderReference) queryForValidation.orderReference = orderReference;
    if (transactionId) queryForValidation.transactionId = transactionId;
    if (amount) queryForValidation.amount = amount;
    if (currency) queryForValidation.currency = currency;
    if (mode) queryForValidation.mode = mode;
    // Add signature to query object (validateSignature reads it for comparison but excludes it from HMAC)
    if (signature) queryForValidation.signature = signature;

    // Log for debugging
    console.log(
      "Verifying payment with query:",
      JSON.stringify(queryForValidation, null, 2)
    );

    const isValid = validateSignature(queryForValidation, config.PaymentApiKey);

    // REJECT invalid signatures in ALL environments (development and production)
    if (!isValid) {
      console.error("Invalid payment signature - potential security breach");
      console.error(
        "Query used for validation:",
        JSON.stringify(queryForValidation, null, 2)
      );
      console.error("Received signature:", signature);
      console.error("Payment status:", paymentStatus);
      console.error("Order ID:", orderId);
      console.error("Merchant Order ID:", merchantOrderId);
      console.error("Original Order ID:", orderId);
      console.error("Transaction ID:", transactionId);
      console.error("Amount:", amount);
      console.error("Currency:", currency);

      return NextResponse.json(
        {
          error: "Invalid signature",
          message:
            "Payment verification failed. Signature validation error. This is a security measure to prevent fraud. If this is a legitimate payment, please check the server logs for debugging information.",
          verified: false,
        },
        { status: 400 }
      );
    }

    // Return verified payment information
    return NextResponse.json({
      verified: true,
      status: paymentStatus,
      orderId: orderId,
      transactionId: transactionId || null,
      amount: amount || null,
      currency: currency || null,
      merchantOrderId: merchantOrderId || orderId,
      message:
        paymentStatus === "SUCCESS"
          ? "Payment verified successfully"
          : `Payment status: ${paymentStatus}`,
    });
  } catch (error: unknown) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        verified: false,
      },
      { status: 500 }
    );
  }
}
