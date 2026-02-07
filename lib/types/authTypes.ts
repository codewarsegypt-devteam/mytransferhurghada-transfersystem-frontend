// =============================================================================
// Auth API Types
// =============================================================================

import type { ApiResponseDto } from "./tripsTypes";

// =============================================================================
// Request
// =============================================================================

export interface GoogleLoginRequest {
  email: string;
  name: string;
  deviceIdentifier: string;
  imageURL: string;
}

// =============================================================================
// Response
// =============================================================================

export interface AuthTokenData {
  accessToken: string;
  accessTokenExpiresAt: string;
}

export type GoogleLoginResponseDto = ApiResponseDto<AuthTokenData>;

// =============================================================================
// Auth State
// =============================================================================

export interface AuthUser {
  email: string;
  name: string;
  imageURL: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  expiresAt: Date | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
