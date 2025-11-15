/**
 * Social authentication types and interfaces
 */

export type SocialProvider = 'line' | 'facebook' | 'google' | 'apple';

export type AuthMethod = 'native' | 'web';

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  idToken?: string;
}

export interface SocialAuthResult {
  provider: SocialProvider;
  token: AuthToken;
  method: AuthMethod;
  rawResponse?: any; // Platform-specific raw response
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  username?: string;
  avatar?: string;
  phone?: string;
}

export interface BackendAuthResponse {
  user: UserProfile;
  appToken: string; // Our backend's JWT token
  refreshToken?: string;
}

export interface SocialAuthError {
  code: string;
  message: string;
  provider: SocialProvider;
  originalError?: any;
}
