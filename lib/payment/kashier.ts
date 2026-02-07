import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

/** -------------------- Types -------------------- */

export type KashierMode = "test" | "live";

export interface KashierOrderHashInput {
  mid: string; // Merchant ID (MID-xxxx)
  merchantOrderId: string | number;
  amount: string | number; // keep as sent to Kashier (e.g. "700.00")
  currency: string; // e.g. "EGP"
  secret: string; // API key / secret used for HMAC
  customerReference?: string; // optional
}

export interface KashierConfig {
  mode: KashierMode | string; // allow any custom env value, but typically "test" | "live"
  baseUrl?: string;
  PaymentApiKey?: string;
  mid?: string;
}

export interface KashierPaymentOrder {
  mid: string;
  merchantOrderId: string | number;
  amount: string | number;
  currency: string;
  hash: string;

  merchantRedirect: string;

  // Optional
  serverWebhook?: string;
  allowedMethods?: string; // e.g. "card, wallet, bank_installments"
  failureRedirect?: string; // "true"/"false"
  redirectMethod?: string; // "get"/"post"
  display?: string; // "ar"/"en"
  brandColor?: string; // e.g. "rgba(163, 0, 0, 1)"
  defaultMethod?: string;
  connectedAccount?: string;
  paymentRequestId?: string;
}

// For validating redirect/webhook signature
export type KashierQuery = Record<
  string,
  string | number | boolean | undefined | null
> & {
  signature?: string;
  mode?: string;
};

/** -------------------- Hash -------------------- */

/**
 * Generate Kashier Order Hash using HMAC SHA256
 * According to documentation: /?payment=mid.orderId.amount.currency[.CustomerReference]
 */
export function generateKashierOrderHash(order: KashierOrderHashInput): string {
  const mid = order.mid;
  const customerReference = order.customerReference ?? "";
  const amount = String(order.amount);
  const currency = order.currency;
  const orderId = String(order.merchantOrderId);
  const secret = order.secret;

  const path = `/?payment=${mid}.${orderId}.${amount}.${currency}${
    customerReference ? "." + customerReference : ""
  }`;

  console.log("Hash path:", path);

  const hash = crypto.createHmac("sha256", secret).update(path).digest("hex");

  console.log("Generated hash:", hash);
  return hash;
}

/** -------------------- Signature Validation -------------------- */

/**
 * Validate signature from Kashier redirect/webhook
 * Excludes 'signature' and 'mode', then builds query string (key=value&key=value...)
 */
export function validateSignature(
  query: KashierQuery,
  secret: string
): boolean {
  // IMPORTANT: The original JS iterates object keys as-is.
  // In real integrations, signatures often require sorted keys.
  // This keeps behavior identical to your current code.
  let queryString = "";

  for (const key in query) {
    if (key === "signature" || key === "mode") continue;

    const value = query[key];
    if (value === undefined || value === null) continue;

    queryString += `&${key}=${String(value)}`;
  }

  const finalUrl = queryString.substring(1); // remove leading '&'

  console.log("Signature validation path:", finalUrl);

  const computed = crypto
    .createHmac("sha256", secret)
    .update(finalUrl)
    .digest("hex");

  const received = String(query.signature ?? "");
  const isValid = computed === received;

  if (isValid) {
    console.log("Success Signature");
  } else {
    console.log("Failed Signature !!");
    console.log("Expected:", computed);
    console.log("Received:", received);
  }

  return isValid;
}

/** -------------------- Config -------------------- */

export function getConfig(): KashierConfig {
  const mode = (process.env.MODE || "test") as KashierMode | string;

  return {
    mode,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL,
    PaymentApiKey: process.env.PAYMENT_API_KEY,
    mid: process.env.MID,
  };
}

/** -------------------- Build Payment URL -------------------- */

export function buildPaymentUrl(
  order: KashierPaymentOrder,
  config: KashierConfig
): string {
  const kashierPaymentUrl = "https://payments.kashier.io/";
  const params: string[] = [];

  // Required parameters
  params.push(`merchantId=${encodeURIComponent(order.mid)}`);
  params.push(`orderId=${encodeURIComponent(String(order.merchantOrderId))}`);
  params.push(`amount=${encodeURIComponent(String(order.amount))}`);
  params.push(`currency=${encodeURIComponent(order.currency)}`);
  params.push(`hash=${encodeURIComponent(order.hash)}`);
  params.push(`mode=${encodeURIComponent(String(config.mode))}`);
  params.push(`merchantRedirect=${encodeURIComponent(order.merchantRedirect)}`);

  // Optional parameters (only add if non-empty)
  const addIfNotEmpty = (key: string, value?: string) => {
    if (value && value.trim() !== "")
      params.push(`${key}=${encodeURIComponent(value)}`);
  };

  addIfNotEmpty("serverWebhook", order.serverWebhook);
  addIfNotEmpty("allowedMethods", order.allowedMethods);
  addIfNotEmpty("failureRedirect", order.failureRedirect);
  addIfNotEmpty("redirectMethod", order.redirectMethod);
  addIfNotEmpty("display", order.display);
  addIfNotEmpty("brandColor", order.brandColor);
  addIfNotEmpty("defaultMethod", order.defaultMethod);
  addIfNotEmpty("connectedAccount", order.connectedAccount);
  addIfNotEmpty("paymentRequestId", order.paymentRequestId);

  return `${kashierPaymentUrl}?${params.join("&")}`;
}


type ParseRequestBodyResult =
  | { success: false; response: NextResponse }
  | { success: true; payload: unknown; body: Record<string, unknown> };

export async function parseRequestBody(
  request: NextRequest
): Promise<ParseRequestBodyResult> {
  let body;
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid Content-Type:", contentType);
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Invalid Content-Type",
            message: "Content-Type must be application/json",
          },
          { status: 400 }
        ),
      };
    }

    body = await request.json();
    
    // Log the raw body for debugging (in production, this helps identify issues)
    console.log("Request body received:", {
      hasPayload: !!body.payload,
      payloadType: typeof body.payload,
      payloadKeys: body.payload && typeof body.payload === 'object' ? Object.keys(body.payload) : null,
      bodyKeys: Object.keys(body || {}),
    });
  } catch (parseError: unknown) {
    const message =
      parseError instanceof Error ? parseError.message : "Unknown error";
    const stack = parseError instanceof Error ? parseError.stack : undefined;
    console.error("Error parsing request body:", {
      error: message,
      stack,
      contentType: request.headers.get("content-type"),
    });
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Invalid request body",
          message: `Failed to parse JSON: ${message}`,
        },
        { status: 400 }
      ),
    };
  }

  // Validate body exists
  if (!body || typeof body !== "object") {
    console.error("Invalid body structure:", body);
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Invalid request body",
          message: "Request body must be a valid JSON object",
        },
        { status: 400 }
      ),
    };
  }

  // Validate required fields
  if (!body.payload) {
    console.error("Missing payload in request body:", {
      bodyKeys: Object.keys(body),
      body: JSON.stringify(body).substring(0, 500), // Log first 500 chars for debugging
    });
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Missing required fields",
          message: "payload is required",
        },
        { status: 400 }
      ),
    };
  }

  const payload = body.payload;
  
  // Validate payload is not null/undefined
  if (payload === null || payload === undefined) {
    console.error("Payload is null or undefined");
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Invalid payload",
          message: "Payload cannot be null or undefined",
        },
        { status: 400 }
      ),
    };
  }

  // Log payload structure for debugging
  console.log("Payload structure:", {
    type: typeof payload,
    isArray: Array.isArray(payload),
    isObject: typeof payload === 'object' && payload !== null,
    keys: typeof payload === 'object' && payload !== null ? Object.keys(payload) : null,
    payloadSize: JSON.stringify(payload).length,
  });

  return { success: true, payload, body };
}

type ValidatePaymentResult =
  | { success: false; response: NextResponse }
  | { success: true; amount: number; currency: string };

/** Payment object from backend: totalPrice as number, string, or { euro: number }; optional currency, status, message */
interface PaymentLike {
  totalPrice?: number | string | { euro?: number };
  currency?: string;
  status?: string;
  message?: string;
}

export function validatePayment(payment: PaymentLike | null | undefined): ValidatePaymentResult {
  // Validate payment response structure
  if (!payment) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Payment not created", message: "Backend did not return payment data" },
        { status: 500 }
      ),
    };
  }

  // Check if response is a FailedResponse
  if (payment && typeof payment === 'object' && 'status' in payment && payment.status === 'failed') {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Payment creation failed", 
          message: payment.message || "Backend returned an error" 
        },
        { status: 500 }
      ),
    };
  }

  // Extract totalPrice - handle both object format { euro: number } and direct number
  let totalPrice: number;
  if (typeof payment.totalPrice === 'number') {
    totalPrice = payment.totalPrice;
  } else if (payment.totalPrice && typeof payment.totalPrice === 'object' && 'euro' in payment.totalPrice) {
    const euro = payment.totalPrice.euro;
    if (typeof euro !== 'number' || isNaN(euro)) {
      console.error("Unexpected payment structure:", JSON.stringify(payment, null, 2));
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Invalid payment amount",
            message: `Invalid total price (euro). Amount must be greater than 0.`,
          },
          { status: 500 }
        ),
      };
    }
    totalPrice = euro;
  } else if (typeof payment.totalPrice === 'string') {
    totalPrice = parseFloat(payment.totalPrice);
  } else {
    // Log the actual payment structure for debugging
    console.error("Unexpected payment structure:", JSON.stringify(payment, null, 2));
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Invalid payment amount", 
          message: `Invalid total price: ${JSON.stringify(payment.totalPrice)}. Amount must be greater than 0.` 
        },
        { status: 500 }
      ),
    };
  }
  
  if (isNaN(totalPrice) || totalPrice <= 0) {
    console.error("Invalid totalPrice value:", totalPrice, "Payment object:", JSON.stringify(payment, null, 2));
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Invalid payment amount", 
          message: `Invalid total price: ${totalPrice}. Amount must be greater than 0.` 
        },
        { status: 500 }
      ),
    };
  }

  if (typeof payment.currency !== 'string' || payment.currency.trim().length === 0) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Invalid currency", 
          message: `Invalid currency: ${payment.currency}. Currency must be a valid string.` 
        },
        { status: 500 }
      ),
    };
  }

  // Default to EUR if not provided
  const currency = payment.currency || 'EUR';
  const amount = totalPrice;

  return { success: true, amount, currency };
}
