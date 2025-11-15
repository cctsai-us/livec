# LINE Login Implementation

Complete implementation of LINE social authentication for Yoii Live Commerce React Native app.

## Overview

This implementation provides:
- Native LINE SDK integration for iOS and Android
- Factory pattern supporting multiple OAuth providers (LINE, Facebook, Google, Apple)
- 3-environment configuration (dev, qa, prod)
- Backend token exchange
- Persistent authentication state
- Error handling and user feedback

## Architecture

```
src/
├── config/
│   ├── environment.ts              # Environment selector
│   └── environments/
│       ├── dev.ts                  # Development config
│       ├── qa.ts                   # QA config
│       └── prod.ts                 # Production config
├── services/
│   └── auth/
│       ├── types.ts                # TypeScript interfaces
│       ├── providers/
│       │   ├── BaseAuthProvider.ts    # Abstract base class
│       │   └── LineAuthProvider.ts    # LINE implementation
│       ├── OAuthService.ts         # Web OAuth fallback
│       └── SocialAuthService.ts    # Main orchestrator
├── context/
│   └── AuthContext.tsx             # Auth state management
└── screens/
    └── auth/
        └── LoginScreen.tsx         # Login UI with social buttons
```

## How It Works

### 1. User Flow

```
User clicks "Continue with LINE" button
    ↓
LoginScreen.handleSocialLogin()
    ↓
AuthContext.loginWithSocial('line')
    ↓
SocialAuthService.loginWithProvider('line')
    ↓
LineAuthProvider.login() → Opens LINE app/web
    ↓
User authorizes in LINE
    ↓
LINE returns access token to app
    ↓
SocialAuthService exchanges token with backend
    ↓
Backend validates LINE token and returns app token + user profile
    ↓
Tokens stored in AsyncStorage
    ↓
User logged in, navigates to MainTabs
```

### 2. Factory Pattern

The system uses a factory pattern for extensibility:

```typescript
// Adding a new provider is simple:
class FacebookAuthProvider extends BaseAuthProvider {
  async login(): Promise<SocialAuthResult> {
    // Facebook-specific implementation
  }
}

// Register in SocialAuthService:
const facebookProvider = new FacebookAuthProvider();
this.providers.set('facebook', facebookProvider);
```

### 3. Environment Configuration

All OAuth credentials are environment-specific:

```typescript
// src/config/environment.ts
const CURRENT_ENV = 'dev'; // Change to 'qa' or 'prod'

// Automatically loads correct config:
// dev → http://192.168.0.150:8000/api/v1
// qa  → https://qa-api.yoii.ai/api/v1
// prod → https://api.yoii.ai/api/v1
```

## Installation

### 1. Install Dependencies

```bash
npm install @xmartlabs/react-native-line
npm install axios
npm install @react-native-async-storage/async-storage

cd ios && pod install && cd ..
```

### 2. Platform Configuration

Follow the instructions in [PLATFORM_CONFIG.md](./PLATFORM_CONFIG.md) to configure:
- Android: AndroidManifest.xml, build.gradle, strings.xml
- iOS: Info.plist, AppDelegate.mm

### 3. Backend API

The backend must implement the token exchange endpoint:

```
POST /api/v1/auth/social/login
Content-Type: application/json

{
  "provider": "line",
  "accessToken": "eyJhbGc...",
  "idToken": "eyJhbGc...",
  "method": "native"
}

Response:
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "avatar": "https://..."
  },
  "appToken": "your-jwt-token",
  "refreshToken": "refresh-token"
}
```

## Usage

### In LoginScreen

```typescript
import { useAuth } from '../../context/AuthContext';

function LoginScreen() {
  const { loginWithSocial } = useAuth();

  const handleLineLogin = async () => {
    try {
      await loginWithSocial('line');
      // Success! User will be navigated automatically
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLineLogin}>
      <Text>Login with LINE</Text>
    </TouchableOpacity>
  );
}
```

### Check Login Status

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Text>Please login</Text>;
  }

  return <Text>Welcome, {user?.name}!</Text>;
}
```

### Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout(); // Clears all tokens and logs out from LINE
};
```

## Configuration Reference

### Environment Variables

| Environment | API Base URL | LINE Channel ID | Callback URL |
|------------|--------------|----------------|--------------|
| dev | http://192.168.0.150:8000/api/v1 | 2008477870 | https://f647762b2120.ngrok-free.app/api/v1 |
| qa | https://qa-api.yoii.ai/api/v1 | 2008477870 | https://qa-api.yoii.ai/api/v1 |
| prod | https://api.yoii.ai/api/v1 | 2008477870 | https://api.yoii.ai/api/v1 |

### LINE SDK Scopes

The implementation requests these permissions:
- `profile` - User's display name and profile picture
- `openid` - OpenID Connect support
- `email` - User's email address (if available)

## Error Handling

### Common Error Codes

| Code | Description | User Action |
|------|-------------|-------------|
| `USER_CANCELLED` | User cancelled login | Silent - no error shown |
| `LOGIN_FAILED` | LINE SDK error | "Login failed. Please try again." |
| `BACKEND_EXCHANGE_FAILED` | Server error | "Unable to connect to server." |
| `PROVIDER_NOT_FOUND` | Provider not initialized | Should not happen in production |

### Error Handling Example

```typescript
try {
  await loginWithSocial('line');
} catch (error: any) {
  if (error.code === 'USER_CANCELLED') {
    // User cancelled - do nothing
    return;
  }

  if (error.code === 'BACKEND_EXCHANGE_FAILED') {
    Alert.alert('Server Error', 'Unable to connect. Please try again later.');
  } else {
    Alert.alert('Login Failed', error.message || 'Unknown error occurred');
  }
}
```

## Storage Keys

The implementation uses these AsyncStorage keys:

| Key | Description |
|-----|-------------|
| `@app_token` | Your backend's JWT token |
| `@refresh_token` | Refresh token for token renewal |
| `@user_profile` | Serialized user profile object |
| `@auth_provider` | Which provider was used ('line', 'facebook', etc.) |
| `@social_token` | The social provider's access token |
| `@yoii_user` | Legacy user storage (deprecated) |
| `@yoii_token` | Legacy token storage (deprecated) |

## Testing

### Test LINE Login Flow

1. Start Metro bundler:
```bash
npm start
```

2. Run on device (simulator won't work for LINE login):
```bash
# iOS
npx react-native run-ios --device "Your iPhone"

# Android
npx react-native run-android
```

3. Click "Continue with LINE" button
4. Authorize in LINE app
5. Should return to app and be logged in

### Debug Logs

The implementation includes detailed logging:

```
[LineAuthProvider] Initialized with channel ID: 2008477870
[LineAuthProvider] Starting LINE login flow...
[LineAuthProvider] Login successful: { userID: '...', displayName: '...' }
[SocialAuthService] line authentication successful
[SocialAuthService] Backend token exchange successful
[AuthContext] Social login successful
```

## Future Enhancements

### Adding Facebook Login

```typescript
// 1. Create FacebookAuthProvider.ts
export class FacebookAuthProvider extends BaseAuthProvider {
  async login(): Promise<SocialAuthResult> {
    // Use react-native-fbsdk-next
  }
}

// 2. Register in SocialAuthService
const facebookProvider = new FacebookAuthProvider();
await facebookProvider.initialize();
this.providers.set('facebook', facebookProvider);

// 3. Use in LoginScreen
await loginWithSocial('facebook');
```

### Adding Google Login

```typescript
// Similar pattern with @react-native-google-signin/google-signin
```

### Web-Based OAuth Fallback

The `OAuthService` provides web-based OAuth for platforms without native SDKs:

```typescript
const oauthService = new OAuthService('line');
const result = await oauthService.startOAuthFlow();
// Opens system browser, returns to app via deep link
```

## Security Considerations

1. **Token Storage**: Tokens are stored in AsyncStorage (unencrypted). Consider using react-native-keychain for production.

2. **SSL Pinning**: Consider adding SSL pinning for API calls to prevent MITM attacks.

3. **State Parameter**: OAuthService includes CSRF protection via state parameter.

4. **Token Expiration**: Implement token refresh logic using the refresh token.

## Support

For issues or questions:
1. Check LINE SDK documentation: https://developers.line.biz/en/docs/line-login-sdks/
2. Review platform configuration: [PLATFORM_CONFIG.md](./PLATFORM_CONFIG.md)
3. Check backend API implementation
4. Review debug logs in Metro console
