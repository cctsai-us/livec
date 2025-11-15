import { SocialProvider, SocialAuthResult, AuthMethod } from '../types';

/**
 * Abstract base class for all social authentication providers
 * Each provider (LINE, Facebook, Google, Apple) must extend this class
 */
export abstract class BaseAuthProvider {
  protected provider: SocialProvider;
  protected preferredMethod: AuthMethod;

  constructor(provider: SocialProvider, preferredMethod: AuthMethod = 'native') {
    this.provider = provider;
    this.preferredMethod = preferredMethod;
  }

  /**
   * Initialize the provider (e.g., SDK initialization)
   * Called once during app startup
   */
  abstract initialize(): Promise<void>;

  /**
   * Perform login flow
   * Returns authentication result with tokens
   */
  abstract login(): Promise<SocialAuthResult>;

  /**
   * Logout from the provider
   */
  abstract logout(): Promise<void>;

  /**
   * Check if user is currently logged in
   */
  abstract isLoggedIn(): Promise<boolean>;

  /**
   * Get current access token if available
   */
  abstract getCurrentToken(): Promise<string | null>;

  /**
   * Refresh access token if supported
   */
  async refreshToken(): Promise<string | null> {
    // Default implementation - not all providers support this
    return null;
  }

  /**
   * Get provider name
   */
  getProvider(): SocialProvider {
    return this.provider;
  }

  /**
   * Get preferred authentication method
   */
  getPreferredMethod(): AuthMethod {
    return this.preferredMethod;
  }
}
