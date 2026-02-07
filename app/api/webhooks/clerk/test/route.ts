import { NextResponse } from 'next/server';

/**
 * Simple test endpoint to verify webhook route is accessible
 * Visit: http://localhost:3000/api/webhooks/clerk/test
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Clerk webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    envCheck: {
      hasWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
    },
  });
}
