'use client';

import { useAuth } from '@clerk/nextjs';
import { useRef, useEffect } from 'react';

/**
 * When the user is signed in with Clerk, calls /api/auth/sync so the backend
 * token is set in an httpOnly cookie in this browser. Runs once per sign-in.
 */
export default function ClerkAuthSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      syncedRef.current = false;
      return;
    }
    if (syncedRef.current) return;
    syncedRef.current = true;

    fetch('/api/auth/sync', { credentials: 'include' })
      .then((res) => {
        if (res.ok) return;
        syncedRef.current = false; // allow retry on next mount if failed
      })
      .catch(() => {
        syncedRef.current = false;
      });
  }, [isLoaded, isSignedIn]);

  return null;
}
