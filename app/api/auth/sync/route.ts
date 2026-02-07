import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { USER_LOGIN } from '@/paths';
import { setAuthCookie } from '@/lib/storage/authToken';
import type { GoogleLoginRequest, GoogleLoginResponseDto } from '@/lib/types/authTypes';

/**
 * GET /api/auth/sync
 *
 * Runs in the user's request context (browser). When the user is signed in with Clerk,
 * calls the backend to get a token and sets it in an httpOnly cookie so the browser
 * stores it. Call this after Clerk sign-in so the backend auth cookie is set.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, reason: 'not_signed_in' }, { status: 401 });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? '';
    const name =
      `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || email;
    const imageURL = user.imageUrl ?? '';

    const deviceIdentifier = `clerk-sync-${Date.now()}`;
    const loginData: GoogleLoginRequest = {
      email,
      name,
      deviceIdentifier,
      imageURL,
    };

    const response = await fetch(USER_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend auth failed in sync:', errorText);
      return NextResponse.json(
        { success: false, error: 'Backend authentication failed' },
        { status: 502 }
      );
    }

    const data: GoogleLoginResponseDto = await response.json();
    if (!data.succeeded || !data.data) {
      return NextResponse.json(
        { success: false, error: data.message ?? 'Backend returned failure' },
        { status: 502 }
      );
    }

    await setAuthCookie(data.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Sync failed' },
      { status: 500 }
    );
  }
}
