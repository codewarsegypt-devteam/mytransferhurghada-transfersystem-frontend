import { NextRequest, NextResponse } from 'next/server';
import { validateSignature, getConfig } from '@/lib/payment/kashier';

/**
 * POST /api/payment/webhook
 * Handles webhook notifications from Kashier (server-to-server)
 * 
 * This endpoint receives payment status updates from Kashier.
 * Always returns "success" to acknowledge receipt.
 */
export async function POST(request: NextRequest) {
    try {
        const config = getConfig();
        
        if (!config.PaymentApiKey) {
            console.error('Configuration error: Missing PaymentApiKey');
            return new NextResponse('Configuration error: Missing PaymentApiKey', { status: 500 });
        }
        
        // Parse request body - can be JSON or form data
        let body;
        const contentType = request.headers.get('content-type');
        
        try {
            if (contentType?.includes('application/json')) {
                body = await request.json();
            } else if (contentType?.includes('application/x-www-form-urlencoded')) {
                // Handle URL-encoded form data
                const formData = await request.formData();
                body = Object.fromEntries(formData.entries());
            } else {
                // Try to parse as JSON first, fallback to form data
                try {
                    body = await request.json();
                } catch {
                    const formData = await request.formData();
                    body = Object.fromEntries(formData.entries());
                }
            }
        } catch (parseError) {
            console.error('Error parsing webhook body:', parseError);
            // Still return success to prevent retries
            return new NextResponse('success', { status: 200 });
        }
        
        console.log('Webhook received - Body:', body);
        
        // Validate webhook signature
        if (body.signature) {
            const isValid = validateSignature(body, config.PaymentApiKey);
            if (!isValid) {
                console.error('Invalid webhook signature');
                return new NextResponse('Invalid signature', { status: 400 });
            }
            console.log('Webhook signature validated successfully');
        } else {
            console.warn('Webhook received without signature - proceeding with caution');
        }
        
        // Extract payment information
        const paymentStatus = body.paymentStatus?.toLowerCase();
        const merchantOrderId = body.merchantOrderId;
        const orderId = body.orderId;
        const transactionId = body.transactionId;
        const amount = body.amount;
        const currency = body.currency;
        
        // Log all received payment information for debugging
        console.log('[WEBHOOK] Payment details:', {
            paymentStatus,
            merchantOrderId,
            orderId,
            transactionId,
            amount,
            currency,
        });
        
        // Handle different payment statuses
        if (paymentStatus === 'success') {
            console.log(`[WEBHOOK] Payment SUCCESS - Order: ${merchantOrderId}, Transaction: ${transactionId}`);
            // Note: Booking is created on the frontend after payment success.
            // The merchantOrderId is a sessionStorage key, not a booking ID.
            // If you need to track payment status in the database, consider:
            // 1. Storing the merchantOrderId in the booking when it's created
            // 2. Or creating the booking with 'pending' status before payment, then updating it here
            
        } else if (paymentStatus === 'failed' || paymentStatus === 'rejected') {
            console.log(`[WEBHOOK] Payment FAILED - Order: ${merchantOrderId}, Transaction: ${transactionId || orderId}`);
            // Payment failed - booking will not be created on frontend
            
        } else if (paymentStatus === 'pending') {
            console.log(`[WEBHOOK] Payment PENDING - Order: ${merchantOrderId}, Transaction: ${transactionId || orderId}`);
            // Payment is still pending
            
        } else {
            console.warn(`[WEBHOOK] Unknown payment status: ${paymentStatus} for Order: ${merchantOrderId}`);
        }
        
        // Always return "success" to acknowledge receipt
        return new NextResponse('success', { status: 200 });
        
    } catch (error) {
        console.error('Error processing webhook:', error);
        // Still return success to prevent retries
        return new NextResponse('success', { status: 200 });
    }
}

