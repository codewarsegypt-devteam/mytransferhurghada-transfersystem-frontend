# Authentication Implementation Guide

## Overview

This authentication system implements secure Google login with token management for the Fox Travel Egypt website. The access token is securely stored in httpOnly cookies to prevent XSS attacks, and automatically included in all external API requests.

## Architecture

### Security Features

1. **httpOnly Cookies**: Access tokens are stored in httpOnly cookies (not accessible via JavaScript), preventing XSS attacks
2. **Automatic Token Injection**: Axios interceptor automatically adds the Bearer token to external API requests
3. **Token Expiration Handling**: Automatically clears expired tokens and redirects on 401 errors
4. **Secure Cookie Settings**: 
   - `httpOnly: true` - Not accessible via JavaScript
   - `secure: true` (production) - Only sent over HTTPS
   - `sameSite: 'lax'` - CSRF protection

### Flow Diagram

```
User → Google Login → External API (google-login)
                           ↓
                      Access Token
                           ↓
                   Next.js API Route
                           ↓
                   httpOnly Cookie
                           ↓
              AuthProvider (React Context)
                           ↓
                Components use useAuth()
                           ↓
          Trip Booking with Auto Token
```

## Files Created

### Types
- `lib/types/authTypes.ts` - TypeScript types for auth requests/responses

### API Layer
- `lib/apis/authApi.ts` - API client functions for authentication
- `lib/apis/axiosInstance.ts` - Axios instance with auth interceptor

### Storage Layer
- `lib/storage/authToken.ts` - Server-side cookie management (httpOnly)

### API Routes (Next.js)
- `app/api/auth/store-token/route.ts` - Store token in httpOnly cookie
- `app/api/auth/get-token/route.ts` - Retrieve token data
- `app/api/auth/clear-token/route.ts` - Clear token (logout)

### React Context & Hooks
- `lib/providers/AuthProvider.tsx` - Auth context provider
- `lib/hooks/useAuth.ts` - Hook to access auth state
- `lib/providers/providers.tsx` - Updated to include AuthProvider

## Usage

### 1. Login with Google

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";

export function LoginButton() {
  const { login, isAuthenticated, user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      await login({
        email: "user@example.com",
        name: "John Doe",
        deviceIdentifier: "device-xyz-123", // Unique device ID
        imageURL: "https://example.com/avatar.jpg"
      });
      
      // User is now logged in
      console.log("Login successful!");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        <img src={user?.imageURL} alt={user?.name} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### 2. Logout

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";

export function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    console.log("Logged out successfully");
  };

  if (!isAuthenticated) {
    return null;
  }

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 3. Protected Routes

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/"); // Redirect to home if not authenticated
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected content here</div>;
}
```

### 4. Display User Info

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";

export function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <img 
        src={user.imageURL} 
        alt={user.name}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}
```

### 5. Automatic Token Usage in API Calls

The authentication token is automatically included in all external API requests (to `NEXT_PUBLIC_API_URL`). You don't need to manually add it:

```tsx
// This will automatically include the auth token
const bookingData = await createTripBooking({
  tripId: 123,
  // ... other booking data
});
```

## API Reference

### `useAuth()` Hook

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `user` | `AuthUser \| null` | Current user data (email, name, imageURL) |
| `accessToken` | `string \| null` | Access token (for display purposes only) |
| `expiresAt` | `Date \| null` | Token expiration date |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isLoading` | `boolean` | Whether auth state is loading |
| `login(data)` | `Promise<void>` | Login function |
| `logout()` | `Promise<void>` | Logout function |
| `refreshAuthState()` | `Promise<void>` | Manually refresh auth state |

### Types

```typescript
interface GoogleLoginRequest {
  email: string;
  name: string;
  deviceIdentifier: string;
  imageURL: string;
}

interface AuthUser {
  email: string;
  name: string;
  imageURL: string;
}

interface AuthTokenData {
  accessToken: string;
  accessTokenExpiresAt: string;
}
```

## Token Flow for Trip Booking

When you call `createTripBooking()`, here's what happens:

1. **Request Initiated**: Component calls `createTripBooking()`
2. **Interceptor Triggered**: Axios interceptor catches the request
3. **Token Retrieval**: Interceptor fetches token from `/api/auth/get-token`
4. **Header Added**: `Authorization: Bearer {token}` added to request
5. **External API Call**: Request sent to `NEXT_PUBLIC_API_URL` with token
6. **Response Received**: Booking confirmation returned

If the token is expired or invalid (401 response):
- Token is automatically cleared
- User is redirected to home page
- User needs to log in again

## Security Considerations

### ✅ What's Secure

- Tokens stored in httpOnly cookies (not accessible to JavaScript)
- HTTPS-only in production
- CSRF protection with sameSite cookie setting
- Automatic token expiration handling
- No tokens exposed in localStorage or sessionStorage

### ⚠️ Important Notes

1. **Device Identifier**: Should be unique per device/browser. Consider using:
   ```typescript
   const deviceId = `${navigator.userAgent}-${Date.now()}`;
   ```

2. **HTTPS Required**: In production, ensure your site uses HTTPS so cookies are sent securely

3. **CORS**: Your external API must accept credentials and have proper CORS headers:
   ```
   Access-Control-Allow-Origin: https://yourdomain.com
   Access-Control-Allow-Credentials: true
   ```

## Environment Variables

Make sure you have:

```env
NEXT_PUBLIC_API_URL=https://your-external-api.com
```

## Testing

### Manual Testing

1. **Login Flow**:
   ```bash
   # Open browser console and run:
   # (Assuming you have a login button)
   # Click login button
   # Check Application > Cookies in DevTools
   # Should see: fox_auth_token (httpOnly)
   ```

2. **Token Expiration**:
   - Wait for token to expire (or manually set a short expiration)
   - Try to make an authenticated request
   - Should auto-logout and redirect

3. **Logout Flow**:
   - Click logout button
   - Check cookies are cleared
   - Verify state resets

## Troubleshooting

### Token Not Being Sent

- Check that `withCredentials: true` is set in axios config
- Verify CORS headers on external API
- Ensure cookies are not being blocked by browser

### 401 Errors After Login

- Verify token format matches API requirements
- Check token expiration time
- Inspect Authorization header in Network tab

### Infinite Redirect Loops

- Make sure login page is not protected
- Check redirect logic in protected route components

## Migration Notes

All existing API calls have been updated to use `axiosInstance` instead of the default `axios`:

- ✅ `lib/apis/tripsApi.ts` - Updated
- ✅ `lib/apis/bookingApi.ts` - Updated
- ✅ `lib/apis/extras.ts` - Updated
- ✅ `lib/apis/authApi.ts` - Updated

No changes needed in existing components - token handling is automatic!
