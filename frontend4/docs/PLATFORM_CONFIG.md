# Platform Configuration for LINE Login

This document outlines the platform-specific configuration required for LINE login to work on iOS and Android.

## Prerequisites

1. Install the LINE SDK package:
```bash
npm install @xmartlabs/react-native-line
cd ios && pod install && cd ..
```

## Android Configuration

### 1. AndroidManifest.xml

Add the following to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest ...>
  <application ...>

    <!-- Existing activity -->
    <activity
      android:name=".MainActivity"
      ...>

      <!-- Add these intent filters for LINE OAuth callback -->
      <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
          android:scheme="yoii-livecomm"
          android:host="oauth"
          android:pathPrefix="/line/callback" />
      </intent-filter>
    </activity>

  </application>
</manifest>
```

### 2. build.gradle

Add LINE SDK dependency to `android/app/build.gradle`:

```gradle
dependencies {
    // ... other dependencies

    implementation 'com.linecorp:linesdk:5.8.1'
}
```

### 3. strings.xml

Add LINE Channel ID to `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">Yoii Live Commerce</string>

    <!-- LINE Configuration -->
    <string name="line_channel_id">2008477870</string>
</resources>
```

### 4. MainApplication.java/kt

Initialize LINE SDK in `android/app/src/main/java/.../MainApplication.java`:

```java
import com.xmartlabs.react_native_line.LineLoginPackage;

public class MainApplication extends Application implements ReactApplication {

  @Override
  public void onCreate() {
    super.onCreate();
    // ... existing code
  }

  // LINE SDK package is automatically added by auto-linking
}
```

## iOS Configuration

### 1. Info.plist

Add the following to `ios/frontend4/Info.plist`:

```xml
<dict>
  <!-- Existing keys -->

  <!-- LINE Configuration -->
  <key>LineSDKConfig</key>
  <dict>
    <key>ChannelID</key>
    <string>2008477870</string>
  </dict>

  <!-- URL Schemes for LINE OAuth callback -->
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleTypeRole</key>
      <string>Editor</string>
      <key>CFBundleURLName</key>
      <string>com.yoii.livecommerce</string>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>yoii-livecomm</string>
        <string>line3rdp.2008477870</string>
      </array>
    </dict>
  </array>

  <!-- Allow LINE app to be opened -->
  <key>LSApplicationQueriesSchemes</key>
  <array>
    <string>lineauth2</string>
  </array>
</dict>
```

### 2. AppDelegate.m/mm

Update `ios/frontend4/AppDelegate.mm` to handle URL callbacks:

```objective-c
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

// ... existing methods

// Add this method to handle URL callbacks
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
```

## Deep Linking Setup

The app uses the custom URL scheme `yoii-livecomm://` for OAuth callbacks.

### Callback URLs:
- LINE: `yoii-livecomm://oauth/line/callback`
- Facebook: `yoii-livecomm://oauth/facebook/callback`
- Google: `yoii-livecomm://oauth/google/callback`

## LINE Developers Console Configuration

In the LINE Developers Console (https://developers.line.biz/console/):

1. Set **Callback URL** to:
   - iOS: `line3rdp.2008477870://authorize`
   - Android: `yoii-livecomm://oauth/line/callback`

2. Enable required permissions:
   - profile
   - openid
   - email

## Testing

### Test on iOS Simulator
```bash
npx react-native run-ios
```

### Test on Android Emulator
```bash
npx react-native run-android
```

### Common Issues

1. **LINE SDK not found**: Run `pod install` in the `ios` folder
2. **Callback not working**: Verify URL schemes are correctly configured
3. **Channel ID mismatch**: Ensure all configs use the same channel ID: `2008477870`

## Environment-Specific Configuration

The app supports 3 environments (dev, qa, prod) with the same LINE Channel ID (2008477870) across all environments. To switch environments, modify `CURRENT_ENV` in `src/config/environment.ts`.
