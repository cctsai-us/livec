import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseAuthProvider } from './providers/BaseAuthProvider';
import { LineAuthProvider } from './providers/LineAuthProvider';
import {
  SocialProvider,
  SocialAuthResult,
  BackendAuthResponse,
  UserProfile,
} from './types';
import { config } from '../../config/environment';

/**
 * Social authentication service orchestrator
 * Manages multiple authentication providers and backend token exchange
 */
export class SocialAuthService {
  private providers: Map<SocialProvider, BaseAuthProvider>;
  private initialized: boolean = false;

  constructor() {
    this.providers = new Map();
  }

  /**
   * Initialize all authentication providers
   * Call this during app startup
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Register LINE provider
      const lineProvider = new LineAuthProvider();
      await lineProvider.initialize();
      this.providers.set('line', lineProvider);

      // TODO: Register other providers (Facebook, Google, Apple)
      // const facebookProvider = new FacebookAuthProvider();
      // await facebookProvider.initialize();
      // this.providers.set('facebook', facebookProvider);

      this.initialized = true;
      console.log('[SocialAuthService] Initialized with providers:', Array.from(this.providers.keys()));
    } catch (error) {
      console.error('[SocialAuthService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Login with a specific social provider
   * 1. Authenticate with social provider (get their token)
   * 2. Exchange social token with backend (get app token)
   * 3. Store app token and user profile
   */
  async loginWithProvider(provider: SocialProvider): Promise<BackendAuthResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const authProvider = this.providers.get(provider);
    if (!authProvider) {
      throw {
        code: 'PROVIDER_NOT_FOUND',
        message: `Provider ${provider} is not registered`,
        provider,
      };
    }

    try {
      console.log(`[SocialAuthService] Starting login with ${provider}...`);

      // Step 1: Authenticate with social provider
      const socialAuthResult: SocialAuthResult = await authProvider.login();

      console.log(`[SocialAuthService] ${provider} authentication successful`);

      // Step 2: Exchange social token with backend
      const backendResponse = await this.exchangeTokenWithBackend(socialAuthResult);

      console.log('[SocialAuthService] Backend token exchange successful');

      // Step 3: Store tokens and user profile
      await this.storeAuthData(backendResponse, socialAuthResult);

      return backendResponse;
    } catch (error: any) {
      console.error(`[SocialAuthService] Login with ${provider} failed:`, error);
      throw error;
    }
  }

  /**
   * Exchange social provider token with backend
   * Backend validates the social token and returns app token + user profile
   */
  private async exchangeTokenWithBackend(
    socialAuthResult: SocialAuthResult
  ): Promise<BackendAuthResponse> {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/auth/social/login`,
        {
          provider: socialAuthResult.provider,
          accessToken: socialAuthResult.token.accessToken,
          idToken: socialAuthResult.token.idToken,
          method: socialAuthResult.method,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[SocialAuthService] Backend token exchange failed:', error);
      throw {
        code: 'BACKEND_EXCHANGE_FAILED',
        message: error.response?.data?.message || 'Failed to exchange token with backend',
        provider: socialAuthResult.provider,
        originalError: error,
      };
    }
  }

  /**
   * Store authentication data in AsyncStorage
   */
  private async storeAuthData(
    backendResponse: BackendAuthResponse,
    socialAuthResult: SocialAuthResult
  ): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['@app_token', backendResponse.appToken],
        ['@user_profile', JSON.stringify(backendResponse.user)],
        ['@auth_provider', socialAuthResult.provider],
        ['@social_token', socialAuthResult.token.accessToken],
      ]);

      if (backendResponse.refreshToken) {
        await AsyncStorage.setItem('@refresh_token', backendResponse.refreshToken);
      }
    } catch (error) {
      console.error('[SocialAuthService] Failed to store auth data:', error);
      throw error;
    }
  }

  /**
   * Logout from current provider and clear stored data
   */
  async logout(provider?: SocialProvider): Promise<void> {
    try {
      // Get current provider if not specified
      if (!provider) {
        const storedProvider = await AsyncStorage.getItem('@auth_provider');
        provider = storedProvider as SocialProvider;
      }

      // Logout from social provider
      if (provider) {
        const authProvider = this.providers.get(provider);
        if (authProvider) {
          await authProvider.logout();
        }
      }

      // Clear all stored auth data
      await AsyncStorage.multiRemove([
        '@app_token',
        '@refresh_token',
        '@user_profile',
        '@auth_provider',
        '@social_token',
      ]);

      console.log('[SocialAuthService] Logout successful');
    } catch (error) {
      console.error('[SocialAuthService] Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get current user profile from storage
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const userJson = await AsyncStorage.getItem('@user_profile');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('[SocialAuthService] Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Get current app token from storage
   */
  async getCurrentToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@app_token');
    } catch (error) {
      console.error('[SocialAuthService] Failed to get current token:', error);
      return null;
    }
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getCurrentToken();
    return token !== null;
  }

  /**
   * Refresh app token using refresh token
   */
  async refreshAppToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem('@refresh_token');
      if (!refreshToken) {
        return null;
      }

      const response = await axios.post(
        `${config.apiBaseUrl}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newToken = response.data.appToken;
      await AsyncStorage.setItem('@app_token', newToken);

      return newToken;
    } catch (error) {
      console.error('[SocialAuthService] Token refresh failed:', error);
      return null;
    }
  }
}

// Singleton instance
export const socialAuthService = new SocialAuthService();
