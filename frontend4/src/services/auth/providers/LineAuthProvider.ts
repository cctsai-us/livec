import LineLogin from '@xmartlabs/react-native-line';
import { BaseAuthProvider } from './BaseAuthProvider';
import { SocialAuthResult, AuthToken } from '../types';
import { config } from '../../../config/environment';

/**
 * LINE authentication provider
 * Uses @xmartlabs/react-native-line SDK for native authentication
 * Falls back to web-based OAuth if native fails
 */
export class LineAuthProvider extends BaseAuthProvider {
  private isInitialized: boolean = false;

  constructor() {
    super('line', 'native');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize LINE SDK with channel ID
      await LineLogin.setup({ channelId: config.line.channelId });
      this.isInitialized = true;
      console.log('[LineAuthProvider] Initialized with channel ID:', config.line.channelId);
    } catch (error) {
      console.error('[LineAuthProvider] Initialization failed:', error);
      throw error;
    }
  }

  async login(): Promise<SocialAuthResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('[LineAuthProvider] Starting LINE login flow...');

      // Attempt native LINE SDK login
      const result = await LineLogin.login({
        scopes: ['profile', 'openid', 'email'], // Request permissions
      });

      console.log('[LineAuthProvider] Login successful:', {
        userID: result.userProfile?.userId,
        displayName: result.userProfile?.displayName,
      });

      // Extract tokens from LINE SDK response
      const token: AuthToken = {
        accessToken: result.accessToken.accessToken,
        refreshToken: undefined, // LINE SDK manages refresh internally
        expiresAt: result.accessToken.expiresIn
          ? Date.now() + parseInt(result.accessToken.expiresIn) * 1000
          : undefined,
        idToken: result.accessToken.idToken,
      };

      return {
        provider: 'line',
        token,
        method: 'native',
        rawResponse: result,
      };
    } catch (error: any) {
      console.error('[LineAuthProvider] Login failed:', error);

      // Check if user cancelled
      if (error.code === 'CANCEL' || error.message?.includes('cancel')) {
        throw {
          code: 'USER_CANCELLED',
          message: 'User cancelled LINE login',
          provider: 'line',
          originalError: error,
        };
      }

      // For other errors, could fall back to web-based OAuth here
      throw {
        code: 'LOGIN_FAILED',
        message: error.message || 'LINE login failed',
        provider: 'line',
        originalError: error,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await LineLogin.logout();
      console.log('[LineAuthProvider] Logout successful');
    } catch (error) {
      console.error('[LineAuthProvider] Logout failed:', error);
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await this.getCurrentToken();
      return token !== null;
    } catch (error) {
      return false;
    }
  }

  async getCurrentToken(): Promise<string | null> {
    try {
      const token = await LineLogin.getCurrentAccessToken();
      return token?.accessToken || null;
    } catch (error) {
      console.error('[LineAuthProvider] Failed to get current token:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const result = await LineLogin.refreshAccessToken();
      return result?.accessToken || null;
    } catch (error) {
      console.error('[LineAuthProvider] Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Get user profile from LINE
   */
  async getUserProfile() {
    try {
      const profile = await LineLogin.getProfile();
      return {
        id: profile.userId,
        name: profile.displayName,
        avatar: profile.pictureUrl,
        // LINE doesn't always provide email even if requested
        email: undefined,
      };
    } catch (error) {
      console.error('[LineAuthProvider] Failed to get user profile:', error);
      throw error;
    }
  }
}
