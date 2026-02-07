# Google OAuth Setup Guide

## Quick Start

This guide will help you integrate Google OAuth with the existing authentication system.

## Prerequisites

1. ✅ Authentication system is already set up (see `AUTH_IMPLEMENTATION.md`)
2. ⬜ Google Cloud Project with OAuth 2.0 credentials
3. ⬜ Google OAuth library installed

## Step 1: Install Google OAuth Library

```bash
npm install @react-oauth/google
```

## Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
7. Add authorized redirect URIs:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
8. Copy your Client ID

## Step 3: Add Environment Variable

```env
# .env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

## Step 4: Wrap App with GoogleOAuthProvider

Update your `app/layout.tsx`:

```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <Providers>
            {children}
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

## Step 5: Create Production-Ready Login Component

Create `components/auth/GoogleLoginButton.tsx`:

```tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/Button";
import axios from 'axios';

export function GoogleLoginButton() {
  const { login, logout, isAuthenticated, user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError(null);
        
        // Get user info from Google
        const { data } = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        // Login to your API
        await login({
          email: data.email,
          name: data.name,
          deviceIdentifier: generateDeviceId(),
          imageURL: data.picture || "https://via.placeholder.com/150"
        });

      } catch (err) {
        setError("Login failed. Please try again.");
        console.error("Login error:", err);
      }
    },
    onError: (error) => {
      setError("Google login failed. Please try again.");
      console.error("Google OAuth error:", error);
    },
  });

  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
    } catch (err) {
      setError("Logout failed. Please try again.");
      console.error("Logout error:", err);
    }
  };

  if (isLoading) {
    return (
      <Button disabled>
        <div className="flex items-center gap-2">
          <Spinner />
          Loading...
        </div>
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
            src={user.imageURL} 
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">{user.name}</span>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button onClick={() => googleLogin()} className="w-full">
        <GoogleIcon className="w-5 h-5 mr-2" />
        Sign in with Google
      </Button>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}

function generateDeviceId(): string {
  const existingId = localStorage.getItem("fox_device_id");
  if (existingId) return existingId;

  const deviceId = `${navigator.userAgent}-${Date.now()}-${Math.random().toString(36)}`;
  localStorage.setItem("fox_device_id", deviceId);
  
  return deviceId;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}
```

## Step 6: Add Login to Your Pages

### Option A: Add to Navigation Bar

Update your navbar component:

```tsx
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export function Navbar() {
  return (
    <nav>
      {/* ... other nav items ... */}
      <GoogleLoginButton />
    </nav>
  );
}
```

### Option B: Dedicated Login Page

Create `app/login/page.tsx`:

```tsx
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome to Fox Travel</h2>
          <p className="mt-2 text-gray-600">Sign in to book your trips</p>
        </div>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
```

## Step 7: Protect Booking Routes

Update your checkout page to require authentication:

```tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {/* Your checkout form */}
    </div>
  );
}
```

## Testing

### 1. Test Login Flow

1. Start your dev server: `npm run dev`
2. Navigate to your login page
3. Click "Sign in with Google"
4. Complete Google OAuth
5. Verify you're logged in
6. Check cookies in DevTools (Application > Cookies)
   - Should see `fox_auth_token` (httpOnly)

### 2. Test API Token

1. Open Network tab in DevTools
2. Make a trip booking
3. Check the request to your API
4. Verify `Authorization: Bearer {token}` header is present

### 3. Test Logout

1. Click logout button
2. Verify cookies are cleared
3. Try accessing protected route
4. Should redirect to login

### 4. Test Token Expiration

1. Manually set token expiration to past date
2. Try making an API request
3. Should auto-logout and redirect

## Troubleshooting

### "Google OAuth popup blocked"

- Make sure you're not blocking popups in your browser
- Try using `ux_mode: 'redirect'` in useGoogleLogin options

### "Token not being sent to API"

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check axios interceptor is working (add console.logs)
- Ensure cookies are not being blocked

### "CORS errors"

Your external API must have these headers:

```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Authorization, Content-Type
```

## Security Checklist

- ✅ Token stored in httpOnly cookie
- ✅ HTTPS in production
- ✅ CSRF protection (sameSite cookie)
- ✅ Token expiration handling
- ✅ Automatic logout on 401
- ⬜ Rate limiting on login endpoint
- ⬜ Device identifier validation
- ⬜ Token refresh mechanism (if needed)

## Next Steps

1. **Production Deployment**:
   - Set up production Google OAuth credentials
   - Configure production domain in Google Cloud Console
   - Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in production env

2. **Enhanced Security**:
   - Implement token refresh mechanism
   - Add rate limiting
   - Set up monitoring for failed login attempts

3. **User Experience**:
   - Add loading states
   - Implement "Remember me" functionality
   - Add account management page

## API Integration Summary

Your backend needs to:

1. Accept `POST /api/Auth/google-login` with:
   ```json
   {
     "email": "string",
     "name": "string",
     "deviceIdentifier": "string",
     "imageURL": "string"
   }
   ```

2. Return:
   ```json
   {
     "succeeded": true,
     "message": "Login successful",
     "data": {
       "accessToken": "jwt-token-here",
       "accessTokenExpiresAt": "2026-02-04T12:16:51.523Z"
     }
   }
   ```

3. Accept `Authorization: Bearer {token}` header on protected endpoints

4. Return 401 when token is invalid/expired

That's it! The frontend handles everything else automatically.
