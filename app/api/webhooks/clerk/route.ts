import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { USER_LOGIN } from '@/paths';
import type { GoogleLoginRequest, GoogleLoginResponseDto } from '@/lib/types/authTypes';

/**
 * Notify backend about Clerk session (for server-side bookkeeping).
 * Does NOT set cookies here: webhooks are called by Clerk's servers, not the user's
 * browser, so Set-Cookie would go to Clerk, not the user. The backend token cookie
 * is set when the user's browser calls GET /api/auth/sync (see ClerkAuthSync).
 */
async function authenticateUserWithBackend(
  email: string,
  name: string,
  imageURL: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const deviceIdentifier = `clerk-session-${Date.now()}`;
    const loginData: GoogleLoginRequest = {
      email,
      name,
      deviceIdentifier,
      imageURL,
    };

    console.log('🔐 Calling backend authentication...', { email, name });

    const response = await fetch(USER_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend authentication failed:', errorText);
      return { success: false, error: errorText };
    }

    const data: GoogleLoginResponseDto = await response.json();

    if (!data.succeeded) {
      console.error('Backend authentication returned failure:', data.message);
      return { success: false, error: data.message };
    }
    console.log('✅ Backend authentication successful (cookie is set via /api/auth/sync in user context)');
    return { success: true };
  } catch (error) {
    console.error('Error authenticating with backend:', error);
    return { success: false, error: String(error) };
  }
}

export async function POST(req: Request) {
  console.log('🎯 Webhook endpoint called at:', new Date().toISOString());
  
  // Get the Clerk webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET not found in environment variables');
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  console.log('✅ Webhook secret found', WEBHOOK_SECRET);

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('📨 Webhook headers:', {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature ? 'present' : 'missing',
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing required Svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  console.log('📦 Webhook payload type:', payload.type);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    console.log('✅ Webhook signature verified');
  } catch (err) {
    console.error('❌ Error verifying webhook signature:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook event
  const eventType = evt.type;
  console.log('📋 Processing event type:', eventType);

  // Handle successful login/session creation
  if (eventType === 'session.created') {
    const { user_id, id: sessionId } = evt.data;

    console.log('🎉 User logged in successfully!', {
      userId: user_id,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Get user details from Clerk
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(user_id);

      const email = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress || '';
      
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || email;
      const imageURL = user.imageUrl || '';

      // Authenticate with backend
      const result = await authenticateUserWithBackend(email, name, imageURL);

      if (!result.success) {
        console.error('⚠️ Failed to authenticate with backend:', result.error);
        // Don't fail the webhook - user is still logged into Clerk
      }
    } catch (error) {
      console.error('Error processing session.created webhook:', error);
      // Don't fail the webhook response if backend call fails
    }
  }

  // Handle user creation (first-time sign up)
  if (eventType === 'user.created') {
    const { id: userId, email_addresses, first_name, last_name } = evt.data;

    const email = email_addresses[0]?.email_address || '';
    const name = `${first_name || ''} ${last_name || ''}`.trim() || email;

    console.log('👤 New user created!', {
      userId: userId,
      email: email,
      name: name,
      timestamp: new Date().toISOString(),
    });

    // Note: session.created will be fired after this, so we'll authenticate then
    // This event is just for logging/analytics purposes
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
