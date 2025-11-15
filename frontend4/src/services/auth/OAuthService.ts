import { Linking } from 'react-native';
import { SocialProvider, AuthToken, SocialAuthResult } from './types';
import { config } from '../../config/environment';

/**
 * Web-based OAuth service for fallback authentication
 * Opens system browser for OAuth flow, returns to app via deep link
 */
export class OAuthService {
  private provider: SocialProvider;
  private pendingPromise: {
    resolve: (result: SocialAuthResult) => void;
    reject: (error: any) => void;
  } | null = null;

  constructor(provider: SocialProvider) {
    this.provider = provider;
  }

  /**
   * Start OAuth flow in system browser
   */
  async startOAuthFlow(): Promise<SocialAuthResult> {
    return new Promise((resolve, reject) => {
      this.pendingPromise = { resolve, reject };

      // Build OAuth URL
      const authUrl = this.buildAuthUrl();

      console.log(`[OAuthService] Opening ${this.provider} OAuth URL:`, authUrl);

      // Open system browser
      Linking.openURL(authUrl).catch((error) => {
        console.error('[OAuthService] Failed to open browser:', error);
        this.pendingPromise = null;
        reject({
          code: 'BROWSER_FAILED',
          message: 'Failed to open browser',
          provider: this.provider,
          originalError: error,
        });
      });

      // Set timeout for OAuth completion (5 minutes)
      setTimeout(() => {
        if (this.pendingPromise) {
          this.pendingPromise.reject({
            code: 'TIMEOUT',
            message: 'OAuth flow timed out',
            provider: this.provider,
          });
          this.pendingPromise = null;
        }
      }, 5 * 60 * 1000);
    });
  }

  /**
   * Handle OAuth callback from deep link
   * Called when app is reopened via custom URL scheme
   */
  handleOAuthCallback(url: string): void {
    if (!this.pendingPromise) {
      console.warn('[OAuthService] No pending OAuth promise found');
      return;
    }

    try {
      const params = this.parseCallbackUrl(url);

      if (params.error) {
        this.pendingPromise.reject({
          code: params.error,
          message: params.error_description || 'OAuth failed',
          provider: this.provider,
        });
        this.pendingPromise = null;
        return;
      }

      if (!params.access_token) {
        this.pendingPromise.reject({
          code: 'NO_TOKEN',
          message: 'No access token in callback',
          provider: this.provider,
        });
        this.pendingPromise = null;
        return;
      }

      const token: AuthToken = {
        accessToken: params.access_token,
        refreshToken: params.refresh_token,
        expiresAt: params.expires_in
          ? Date.now() + parseInt(params.expires_in, 10) * 1000
          : undefined,
        idToken: params.id_token,
      };

      this.pendingPromise.resolve({
        provider: this.provider,
        token,
        method: 'web',
        rawResponse: params,
      });
      this.pendingPromise = null;
    } catch (error) {
      this.pendingPromise.reject({
        code: 'PARSE_ERROR',
        message: 'Failed to parse OAuth callback',
        provider: this.provider,
        originalError: error,
      });
      this.pendingPromise = null;
    }
  }

  /**
   * Build OAuth authorization URL based on provider
   */
  private buildAuthUrl(): string {
    const callbackUrl = `yoii-livecomm://oauth/${this.provider}/callback`;

    switch (this.provider) {
      case 'line':
        return (
          `https://access.line.me/oauth2/v2.1/authorize?` +
          `response_type=code&` +
          `client_id=${config.line.channelId}&` +
          `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
          `state=${this.generateState()}&` +
          `scope=profile%20openid%20email`
        );

      case 'facebook':
        return (
          `https://www.facebook.com/v18.0/dialog/oauth?` +
          `client_id=${config.facebook.appId}&` +
          `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
          `state=${this.generateState()}&` +
          `scope=public_profile,email`
        );

      case 'google':
        return (
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${config.google.clientId}&` +
          `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
          `response_type=code&` +
          `scope=profile%20email&` +
          `state=${this.generateState()}`
        );

      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  /**
   * Parse callback URL parameters
   */
  private parseCallbackUrl(url: string): any {
    const params: any = {};
    const urlObj = new URL(url);

    // Parse query string
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Parse hash fragment (some providers use this)
    if (urlObj.hash) {
      const hashParams = new URLSearchParams(urlObj.hash.substring(1));
      hashParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    return params;
  }

  /**
   * Generate random state for CSRF protection
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Cancel pending OAuth flow
   */
  cancel(): void {
    if (this.pendingPromise) {
      this.pendingPromise.reject({
        code: 'USER_CANCELLED',
        message: 'User cancelled OAuth flow',
        provider: this.provider,
      });
      this.pendingPromise = null;
    }
  }
}
