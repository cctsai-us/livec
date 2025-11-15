# LINE Login Implementation - TODO Checklist

## ✅ Completed

- [x] Environment configuration files (dev, qa, prod)
- [x] TypeScript type definitions
- [x] BaseAuthProvider abstract class
- [x] LineAuthProvider implementation
- [x] OAuthService for web-based fallback
- [x] SocialAuthService orchestrator
- [x] AuthContext integration
- [x] LoginScreen integration
- [x] Documentation (PLATFORM_CONFIG.md, LINE_LOGIN_IMPLEMENTATION.md)

## 📋 Manual Steps Required

### 1. Install Dependencies

```bash
npm install @xmartlabs/react-native-line axios @react-native-async-storage/async-storage
```

```bash
cd ios && pod install && cd ..
```

### 2. Android Configuration

#### 2.1 Edit `android/app/src/main/AndroidManifest.xml`

Find the `<activity android:name=".MainActivity">` section and add this intent filter inside it:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data
    android:scheme="yoii-livecomm"
    android:host="oauth"
    android:pathPrefix="/line/callback" />
</intent-filter>
```

#### 2.2 Edit `android/app/build.gradle`

Add to the `dependencies` section:

```gradle
implementation 'com.linecorp:linesdk:5.8.1'
```

#### 2.3 Edit `android/app/src/main/res/values/strings.xml`

Add inside `<resources>`:

```xml
<string name="line_channel_id">2008477870</string>
```

### 3. iOS Configuration

#### 3.1 Edit `ios/frontend4/Info.plist`

Add these sections inside the main `<dict>`:

```xml
<!-- LINE Configuration -->
<key>LineSDKConfig</key>
<dict>
  <key>ChannelID</key>
  <string>2008477870</string>
</dict>

<!-- URL Schemes -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>yoii-livecomm</string>
      <string>line3rdp.2008477870</string>
    </array>
  </dict>
</array>

<!-- Allow LINE app queries -->
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>lineauth2</string>
</array>
```

#### 3.2 Edit `ios/frontend4/AppDelegate.mm`

Add this import at the top:
```objective-c
#import <React/RCTLinkingManager.h>
```

Add this method before `@end`:
```objective-c
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

### 4. Backend API

Implement this endpoint in your backend:

**Endpoint:** `POST /api/v1/auth/social/login`

**Request:**
```json
{
  "provider": "line",
  "accessToken": "LINE_ACCESS_TOKEN",
  "idToken": "LINE_ID_TOKEN",
  "method": "native"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "name": "User Name",
    "email": "user@example.com",
    "username": "username",
    "avatar": "https://..."
  },
  "appToken": "YOUR_JWT_TOKEN",
  "refreshToken": "REFRESH_TOKEN"
}
```

**Backend Logic:**
1. Receive LINE access token
2. Verify with LINE API: `GET https://api.line.me/v2/profile`
3. Create/update user in database
4. Generate your JWT token
5. Return user + token

### 5. LINE Developers Console

Go to https://developers.line.biz/console/

**Channel:** 2008477870

**Settings to verify:**
- ✅ Callback URLs configured
  - iOS: `line3rdp.2008477870://authorize`
  - Android: `yoii-livecomm://oauth/line/callback`
- ✅ Scopes enabled: profile, openid, email
- ✅ App published (not in draft mode)

### 6. Test

```bash
# Start Metro
npm start

# Run on REAL DEVICE (simulator won't work for LINE)
npx react-native run-ios --device "Your iPhone"
# OR
npx react-native run-android
```

**Test Flow:**
1. Open app → Login screen
2. Click "Continue with LINE"
3. LINE app opens (or browser)
4. Authorize app
5. Return to app
6. Should be logged in ✅

### 7. Verify Logs

Check Metro console for:
```
✅ [LineAuthProvider] Initialized with channel ID: 2008477870
✅ [LineAuthProvider] Starting LINE login flow...
✅ [LineAuthProvider] Login successful: { userID: '...', displayName: '...' }
✅ [SocialAuthService] line authentication successful
✅ [SocialAuthService] Backend token exchange successful
✅ [AuthContext] Social login successful
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Module not found: @xmartlabs/react-native-line" | Run `npm install` and `pod install` |
| LINE app doesn't open | Check Info.plist URL schemes are correct |
| "Invalid redirect_uri" | Verify LINE console callback URLs match |
| App crashes on return from LINE | Check AppDelegate.mm has openURL method |
| Backend exchange fails | Check API endpoint is correct and accessible |

## 📚 Documentation

- **Full implementation guide:** `docs/LINE_LOGIN_IMPLEMENTATION.md`
- **Platform configuration:** `docs/PLATFORM_CONFIG.md`
- **Summary of changes:** `docs/IMPLEMENTATION_SUMMARY.md`

## 🎯 Production Checklist

Before going to production:

- [ ] Switch environment to 'prod' in `src/config/environment.ts`
- [ ] Implement token refresh logic
- [ ] Add secure token storage (react-native-keychain)
- [ ] Add SSL pinning for API calls
- [ ] Add error logging (Sentry, Bugsnag)
- [ ] Test on multiple devices
- [ ] Verify LINE app is approved in LINE Developers Console
- [ ] Add analytics tracking
- [ ] Review and test error scenarios
- [ ] Update privacy policy to mention LINE login

## 🚀 Next Features

- [ ] Implement Facebook login
- [ ] Implement Google login
- [ ] Implement Apple login
- [ ] Add phone number verification
- [ ] Add 2FA support
- [ ] Implement account linking (merge social accounts)
