/**
 * Secure token storage using httpOnly cookies.
 * 
 * IMPORTANT: Tokens are stored in httpOnly cookies set by Next.js API routes.
 * This prevents XSS attacks since JavaScript cannot access httpOnly cookies.
 * 
 * The token is automatically included in requests via the cookie header.
 * For external API calls, an axios interceptor adds the token from cookies.
 */

import { cookies } from "next/headers";
import type { AuthTokenData } from "@/lib/types/authTypes";

const TOKEN_COOKIE_NAME = "fox_auth_token";
const EXPIRY_COOKIE_NAME = "fox_auth_expiry";

/**
 * Store auth token in httpOnly cookie (server-side only).
 * Call this from a Next.js API route, not from client components.
 */
export async function setAuthCookie(tokenData: AuthTokenData): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = new Date(tokenData.accessTokenExpiresAt);
  
  cookieStore.set(TOKEN_COOKIE_NAME, tokenData.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  cookieStore.set(EXPIRY_COOKIE_NAME, tokenData.accessTokenExpiresAt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Get auth token from httpOnly cookie (server-side only).
 */
export async function getAuthCookie(): Promise<AuthTokenData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  const expiry = cookieStore.get(EXPIRY_COOKIE_NAME)?.value;

  if (!token || !expiry) {
    return null;
  }

  // Check if token is expired
  if (new Date(expiry) < new Date()) {
    await clearAuthCookie();
    return null;
  }

  return {
    accessToken: token,
    accessTokenExpiresAt: expiry,
  };
}

/**
 * Clear auth token from httpOnly cookie (server-side only).
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete(TOKEN_COOKIE_NAME);
  cookieStore.delete(EXPIRY_COOKIE_NAME);
}

/**
 * Check if user is authenticated (server-side only).
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthCookie();
  return token !== null;
}
