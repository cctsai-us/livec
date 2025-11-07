# Social Authentication Setup Guide

This guide covers setting up social authentication providers for Taiwan and Thailand markets.

## Overview

Supported providers:
- **Taiwan**: LINE, Facebook, Instagram, Google, Apple
- **Thailand**: Facebook, LINE, Google, Apple, Kapook (placeholder)

## LINE Login

LINE is the most popular messaging app in both Taiwan and Thailand.

### 1. Create LINE Login Channel

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a new provider (if needed)
3. Create a new LINE Login channel
4. Note your **Channel ID** and **Channel Secret**

### 2. Configure Channel Settings

**Callback URL:**
```
Production: https://yourdomain.com/api/v1/auth/social/line/callback
Development: http://localhost:8000/api/v1/auth/social/line/callback
```

**Scopes:**
- `profile` (required)
- `email` (optional but recommended)
- `openid` (for OpenID Connect)

### 3. Add Credentials

**Backend (.env):**
```bash
LINE_CHANNEL_ID=your_channel_id
LINE_CHANNEL_SECRET=your_channel_secret
LINE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/social/line/callback
```

**Flutter (.env):**
```bash
LINE_CHANNEL_ID=your_channel_id
```

### 4. Flutter Integration

Add to `pubspec.yaml`:
```yaml
dependencies:
  flutter_line_sdk: ^2.3.3
```

Implementation:
```dart
import 'package:flutter_line_sdk/flutter_line_sdk.dart';

// Initialize
await LineSDK.instance.setup(lineChannelId);

// Login
final result = await LineSDK.instance.login();
final accessToken = result.accessToken.value;

// Send to backend
await apiClient.post('/auth/social/line', {
  'access_token': accessToken,
});
```

## Facebook Login

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Note your **App ID** and **App Secret**

### 2. Configure OAuth Settings

**Valid OAuth Redirect URIs:**
```
https://yourdomain.com/api/v1/auth/social/facebook/callback
http://localhost:8000/api/v1/auth/social/facebook/callback
```

**Valid Origins:**
```
https://yourdomain.com
```

### 3. App Review

Request the following permissions:
- `email` (required)
- `public_profile` (default)

### 4. Add Credentials

**Backend (.env):**
```bash
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

**Flutter (.env):**
```bash
FACEBOOK_APP_ID=your_app_id
```

### 5. Platform-Specific Setup

**iOS (ios/Runner/Info.plist):**
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>fb[APP_ID]</string>
    </array>
  </dict>
</array>

<key>FacebookAppID</key>
<string>[APP_ID]</string>
<key>FacebookDisplayName</key>
<string>Live Commerce</string>
```

**Android (android/app/src/main/res/values/strings.xml):**
```xml
<string name="facebook_app_id">[APP_ID]</string>
<string name="fb_login_protocol_scheme">fb[APP_ID]</string>
```

### 6. Flutter Integration

```dart
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';

final LoginResult result = await FacebookAuth.instance.login();

if (result.status == LoginStatus.success) {
  final accessToken = result.accessToken!.token;

  // Send to backend
  await apiClient.post('/auth/social/facebook', {
    'access_token': accessToken,
  });
}
```

## Google Sign-In

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials

### 2. Create OAuth Client IDs

You need separate credentials for each platform:

**Web Application:**
- For backend API

**iOS:**
- iOS Client ID
- iOS URL scheme

**Android:**
- Android Client ID
- SHA-1 certificate fingerprint

### 3. Configure Consent Screen

1. Configure OAuth consent screen
2. Add scopes: `email`, `profile`
3. Add test users (for development)

### 4. Add Credentials

**Backend (.env):**
```bash
GOOGLE_CLIENT_ID=your_web_client_id
GOOGLE_CLIENT_SECRET=your_web_client_secret
```

**Flutter (.env):**
```bash
GOOGLE_CLIENT_ID_IOS=your_ios_client_id
GOOGLE_CLIENT_ID_ANDROID=your_android_client_id
GOOGLE_CLIENT_ID_WEB=your_web_client_id
```

### 5. Flutter Integration

```dart
import 'package:google_sign_in/google_sign_in.dart';

final GoogleSignIn googleSignIn = GoogleSignIn(
  scopes: ['email', 'profile'],
);

final GoogleSignInAccount? account = await googleSignIn.signIn();

if (account != null) {
  final GoogleSignInAuthentication auth = await account.authentication;
  final accessToken = auth.accessToken;

  // Send to backend
  await apiClient.post('/auth/social/google', {
    'access_token': accessToken,
  });
}
```

## Apple Sign In

Apple Sign In is required for iOS apps that use other social logins.

### 1. Configure App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Certificates, Identifiers & Profiles
3. Identifiers → App IDs
4. Enable "Sign In with Apple"

### 2. Create Service ID

1. Create a Services ID
2. Configure "Sign in with Apple"
3. Add return URLs:
```
https://yourdomain.com/api/v1/auth/social/apple/callback
```

### 3. Create Private Key

1. Keys → Create new key
2. Enable "Sign in with Apple"
3. Download private key (.p8 file)
4. Note Key ID

### 4. Add Credentials

**Backend (.env):**
```bash
APPLE_CLIENT_ID=your_service_id
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY_PATH=/path/to/AuthKey.p8
```

### 5. Flutter Integration

```dart
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

final credential = await SignInWithApple.getAppleIDCredential(
  scopes: [
    AppleIDAuthorizationScopes.email,
    AppleIDAuthorizationScopes.fullName,
  ],
);

final identityToken = credential.identityToken;

// Send to backend
await apiClient.post('/auth/social/apple', {
  'identity_token': identityToken,
});
```

## Instagram Login

Instagram uses Facebook's Graph API.

### 1. Facebook App Setup

1. Same Facebook app as Facebook Login
2. Add "Instagram" product
3. Configure Instagram Basic Display

### 2. Add Credentials

Uses same credentials as Facebook.

### 3. Implementation

Similar to Facebook login but with Instagram-specific scopes.

## Kapook Login (Thailand) - Placeholder

Kapook is a Thai web portal. Integration details pending.

```dart
// Placeholder for future implementation
class KapookAuthProvider {
  Future<String> login() async {
    // TODO: Implement Kapook OAuth flow
    throw UnimplementedError('Kapook login not yet implemented');
  }
}
```

## Backend Implementation

### Social Auth Base Handler

```python
# backend/app/core/social/base.py

from abc import ABC, abstractmethod
import httpx

class SocialAuthProvider(ABC):
    @abstractmethod
    async def get_user_info(self, access_token: str) -> dict:
        """Get user info from provider"""
        pass

    @abstractmethod
    async def verify_token(self, token: str) -> bool:
        """Verify access token"""
        pass
```

### LINE Implementation Example

```python
# backend/app/core/social/line.py

class LINEAuthProvider(SocialAuthProvider):
    PROFILE_URL = "https://api.line.me/v2/profile"
    VERIFY_URL = "https://api.line.me/oauth2/v2.1/verify"

    async def get_user_info(self, access_token: str) -> dict:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.PROFILE_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            response.raise_for_status()
            return response.json()

    async def verify_token(self, token: str) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.VERIFY_URL,
                data={"access_token": token}
            )
            return response.status_code == 200
```

## Error Handling

### Common Errors

**Invalid Token:**
```json
{
  "error": "invalid_token",
  "message": "The access token is invalid or expired"
}
```

**User Cancelled:**
```json
{
  "error": "user_cancelled",
  "message": "User cancelled the login process"
}
```

**Network Error:**
```json
{
  "error": "network_error",
  "message": "Failed to connect to authentication provider"
}
```

## Testing

### Test Accounts

Create test accounts for each provider:
- LINE: Use LINE developer account
- Facebook: Add test users in App Dashboard
- Google: Add test users in OAuth consent screen
- Apple: Use Sandbox environment

### Local Testing

Use ngrok for local testing with OAuth redirects:

```bash
ngrok http 8000

# Use ngrok URL in OAuth callback settings
https://abc123.ngrok.io/api/v1/auth/social/line/callback
```

## Security Best Practices

1. **Validate Tokens Server-Side**
   - Never trust client-provided tokens
   - Always verify with provider's API

2. **Secure Token Storage**
   - Store access tokens encrypted
   - Never log sensitive tokens

3. **Handle Token Expiration**
   - Implement refresh token logic
   - Handle expiration gracefully

4. **Rate Limiting**
   - Limit authentication attempts
   - Prevent brute force attacks

5. **HTTPS Only**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS

## Troubleshooting

### LINE Issues

**"Invalid redirect_uri":**
- Ensure callback URL matches exactly in LINE console
- Check for trailing slashes

### Facebook Issues

**"URL Blocked":**
- Add domain to "App Domains"
- Configure "Valid OAuth Redirect URIs"

### Google Issues

**"Error 400: redirect_uri_mismatch":**
- Ensure redirect URI matches exactly
- Check authorized redirect URIs in console

### Apple Issues

**"Invalid client":**
- Verify Service ID is correct
- Check bundle ID matches

## Multi-Country Support

### Language Detection

```dart
// Detect user's country/language
String getCountryCode() {
  // Taiwan: TW, Thailand: TH
  return Platform.localeName.split('_').last;
}

// Show appropriate social login buttons
List<SocialProvider> getProvidersForCountry(String country) {
  if (country == 'TW') {
    return [LINE, Facebook, Instagram, Google, Apple];
  } else if (country == 'TH') {
    return [Facebook, LINE, Google, Apple, Kapook];
  }
  return [Facebook, Google, Apple]; // Default
}
```

## Further Reading

- [LINE Developers Documentation](https://developers.line.biz/en/docs/)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
