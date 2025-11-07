# Phase 1: One-Week Sprint Plan

**Deadline**: 7 days from start
**Goal**: Working mobile + web live streaming app with multi-language support

## Languages Required
- 🇹🇼 Traditional Chinese (zh_TW) - Taiwan
- 🇨🇳 Simplified Chinese (zh_CN) - China
- 🇹🇭 Thai (th) - Thailand
- 🇯🇵 Japanese (ja) - Japan
- 🇬🇧 English (en) - International

---

## Day 1: Setup & Cloudflare Integration (8-10 hours)

### Morning (4-5 hours)
**Cloudflare Setup**
- [ ] Create Cloudflare account
- [ ] Enable Cloudflare Stream
- [ ] Create R2 bucket: `live-commerce-storage`
- [ ] Get API credentials (Account ID, API Token, Customer Code)
- [ ] Set up webhook URL placeholder
- [ ] Create test stream to verify setup

**Backend Foundation**
- [ ] Update `backend/.env` with Cloudflare credentials
- [ ] Install dependencies: `cloudflare`, `boto3`, `httpx`
- [ ] Create database models for streams
  - `backend/app/models/stream.py`
  - Fields: id, title, cloudflare_uid, broadcaster_id, status, rtmps_url, playback_url

### Afternoon (4-5 hours)
**Backend Cloudflare Integration**
- [ ] Implement `backend/app/core/cloudflare_stream.py`
  - `create_live_input()` - Create stream
  - `get_stream_status()` - Check if live
  - `get_stream_playback_url()` - Get HLS URL
  - `delete_live_input()` - Delete stream
  - `set_webhook_url()` - Configure webhooks

- [ ] Implement stream endpoints `backend/app/api/v1/streams.py`
  - POST `/streams` - Create stream
  - GET `/streams/{id}` - Get stream details
  - GET `/streams` - List all streams
  - DELETE `/streams/{id}` - Delete stream

- [ ] Test API with Postman/curl

**Deliverable**: Backend can create/manage Cloudflare streams via API ✅

---

## Day 2: Frontend Foundation + Localization (8-10 hours)

### Morning (4-5 hours)
**Flutter Project Setup**
- [ ] Verify Flutter project structure
- [ ] Update `pubspec.yaml` dependencies:
  ```yaml
  dependencies:
    dio: ^5.4.0
    video_player: ^2.8.2
    chewie: ^1.7.5
    camera: ^0.10.5
    flutter_localizations:
      sdk: flutter
    intl: ^0.19.0
    provider: ^6.1.1
    shared_preferences: ^2.2.2
    flutter_secure_storage: ^9.0.0
  ```

**Multi-Language Setup**
- [ ] Create ARB files in `frontend/lib/l10n/`:
  - `app_en.arb` - English (base)
  - `app_zh_TW.arb` - Traditional Chinese
  - `app_zh_CN.arb` - Simplified Chinese
  - `app_th.arb` - Thai
  - `app_ja.arb` - Japanese

- [ ] Configure `l10n.yaml`:
  ```yaml
  arb-dir: lib/l10n
  template-arb-file: app_en.arb
  output-localization-file: app_localizations.dart
  ```

- [ ] Run `flutter gen-l10n` to generate localization code

- [ ] Update `main.dart` with locale support:
  ```dart
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  ```

### Afternoon (4-5 hours)
**API Client Implementation**
- [ ] Implement `frontend/lib/core/network/api_client.dart`
  - Configure Dio with base URL
  - Add interceptors for auth
  - Error handling

- [ ] Implement `frontend/lib/core/network/websocket_client.dart`
  - WebSocket connection manager
  - Auto-reconnect logic

**State Management Setup**
- [ ] Set up Provider structure
- [ ] Create stream provider
- [ ] Create viewer count provider

**Deliverable**: Flutter app with 5 languages configured, API client ready ✅

---

## Day 3: Mobile Broadcasting (10-12 hours)

### Morning (5-6 hours)
**Platform Channels for RTMP**

**Android RTMP Integration**
- [ ] Add to `android/app/build.gradle`:
  ```gradle
  dependencies {
      implementation 'com.github.pedroSG94:rtmp-rtsp-stream-client-java:2.2.7'
  }
  ```

- [ ] Create `android/app/src/main/kotlin/.../RtmpStreamingPlugin.kt`:
  ```kotlin
  class RtmpStreamingPlugin : MethodCallHandler {
      fun startStream(rtmpUrl: String, streamKey: String)
      fun stopStream()
      fun switchCamera()
  }
  ```

**iOS RTMP Integration**
- [ ] Add to `ios/Podfile`:
  ```ruby
  pod 'HaishinKit', '~> 1.4'
  ```

- [ ] Create `ios/Runner/RtmpStreamingPlugin.swift`:
  ```swift
  class RtmpStreamingPlugin {
      func startStream(rtmpUrl: String, streamKey: String)
      func stopStream()
      func switchCamera()
  }
  ```

### Afternoon (5-6 hours)
**Flutter Broadcasting UI**
- [ ] Implement `frontend/lib/features/live_stream/presentation/screens/broadcaster_screen.dart`
  - Camera preview
  - Start/Stop streaming button
  - Camera flip button
  - Stream title input
  - Viewer count display
  - Multi-language support for all UI text

- [ ] Implement platform channel calls:
  ```dart
  static const platform = MethodChannel('live_commerce/rtmp');
  await platform.invokeMethod('startStream', {
    'rtmpUrl': stream.rtmpsUrl,
    'streamKey': stream.rtmpsKey,
  });
  ```

- [ ] Add camera permissions handling
- [ ] Implement stream creation flow:
  1. Enter stream title
  2. Call API to create stream
  3. Get RTMPS URL + key
  4. Start camera preview
  5. Start RTMP streaming
  6. Show "LIVE" indicator

**Deliverable**: Mobile app can broadcast to Cloudflare via RTMPS ✅

---

## Day 4: Mobile Viewing + Chat (10-12 hours)

### Morning (5-6 hours)
**Video Player Implementation**
- [ ] Implement `frontend/lib/features/live_stream/presentation/screens/viewer_screen.dart`
  - HLS video player (Chewie + VideoPlayer)
  - Stream title overlay
  - Viewer count display
  - Chat overlay (bottom 30% of screen)
  - Full-screen support
  - Loading states
  - Error handling

- [ ] Implement `frontend/lib/features/live_stream/presentation/widgets/viewer_count_widget.dart`
  - Real-time viewer count from WebSocket
  - Eye icon + count
  - Auto-update every 5 seconds

**Stream List Screen**
- [ ] Implement `frontend/lib/features/live_stream/presentation/screens/stream_list_screen.dart`
  - Grid/List view of streams
  - LIVE badge for active streams
  - Thumbnail images
  - Broadcaster name
  - Viewer count
  - Pull-to-refresh
  - Multi-language labels

### Afternoon (5-6 hours)
**Real-time Chat**
- [ ] Backend WebSocket handler `backend/app/websocket/chat_handler.py`
  - Connect/disconnect handling
  - Message broadcasting
  - User authentication
  - Rate limiting

- [ ] Implement `frontend/lib/features/live_stream/presentation/widgets/chat_widget.dart`
  - WebSocket connection
  - Message list (scrollable)
  - Message input field
  - Send button
  - Auto-scroll to latest
  - Username colors
  - System messages (user joined/left)

- [ ] Backend viewer count tracking (Redis)
  - Increment on WebSocket connect
  - Decrement on disconnect
  - Broadcast count updates

**Deliverable**: Mobile app can view streams + real-time chat ✅

---

## Day 5: H5 Web Support + Polish (10-12 hours)

### Morning (5-6 hours)
**Web Build Optimization**
- [ ] Test Flutter web build:
  ```bash
  flutter build web --release
  ```

- [ ] Fix web-specific issues:
  - CORS for HLS playback
  - Camera access (limited on web)
  - WebSocket connections
  - Responsive design

- [ ] Web broadcasting considerations:
  - Show "Use mobile app for broadcasting" message
  - OR implement WebRTC WHIP if time permits
  - Desktop users should use OBS

- [ ] Configure `web/index.html`:
  - Meta tags for SEO
  - Language support
  - Mobile viewport

**Responsive Design**
- [ ] Test on different screen sizes:
  - Mobile portrait/landscape
  - Tablet
  - Desktop browser

### Afternoon (5-6 hours)
**UI/UX Polish**
- [ ] Add loading states everywhere:
  - Shimmer placeholders for stream list
  - Loading spinner for video buffering
  - Progress indicators for API calls

- [ ] Error handling:
  - Network errors (retry button)
  - Stream offline message
  - Permission denied messages
  - Multi-language error messages

- [ ] Add animations:
  - LIVE indicator pulse
  - Chat message slide-in
  - Smooth transitions

- [ ] Accessibility:
  - Screen reader support
  - High contrast mode
  - Proper semantic labels

**Deliverable**: H5 web app working for viewing, responsive design ✅

---

## Day 6: Testing & Bug Fixes (10-12 hours)

### Morning (5-6 hours)
**Backend Testing**
- [ ] Test all API endpoints:
  - Create stream (get RTMPS credentials)
  - Get stream status
  - List streams (live vs offline)
  - Delete stream

- [ ] Test WebSocket:
  - Multiple concurrent connections
  - Message broadcasting
  - Reconnection logic
  - Viewer count accuracy

- [ ] Test Cloudflare integration:
  - Stream creation
  - Webhook reception
  - Recording availability

- [ ] Load testing (optional):
  - 100+ concurrent viewers
  - Multiple streams simultaneously

### Afternoon (5-6 hours)
**Frontend Testing**

**Mobile Testing (Android)**
- [ ] Test on real Android device:
  - Broadcasting (camera, permissions)
  - Viewing (video playback)
  - Chat (send/receive)
  - Language switching
  - Network interruption recovery

**Mobile Testing (iOS)**
- [ ] Test on real iOS device:
  - Broadcasting (camera, permissions)
  - Viewing (video playback)
  - Chat (send/receive)
  - Language switching
  - Background/foreground transitions

**Web Testing**
- [ ] Test on browsers:
  - Chrome
  - Safari
  - Firefox
  - Mobile browsers

**Bug Fixes**
- [ ] Fix critical bugs
- [ ] Optimize performance issues
- [ ] Improve UX based on testing

**Deliverable**: All critical bugs fixed, app stable ✅

---

## Day 7: Localization QA & Final Polish (8-10 hours)

### Morning (4-5 hours)
**Translation Completion**
- [ ] Complete all ARB files with proper translations:
  - `app_en.arb` ✓ (English - baseline)
  - `app_zh_TW.arb` ✓ (繁體中文)
  - `app_zh_CN.arb` ✓ (简体中文)
  - `app_th.arb` ✓ (ไทย)
  - `app_ja.arb` ✓ (日本語)

**Key Strings to Translate** (minimum 50 strings):
```json
{
  "appName": "Live Commerce",
  "home": "Home",
  "goLive": "Go Live",
  "liveNow": "LIVE NOW",
  "viewers": "viewers",
  "viewerCount": "{count} viewers",
  "startBroadcasting": "Start Broadcasting",
  "stopBroadcasting": "Stop Broadcasting",
  "streamTitle": "Stream Title",
  "enterStreamTitle": "Enter stream title",
  "chat": "Chat",
  "sendMessage": "Send message",
  "typeMessage": "Type a message...",
  "userJoined": "{username} joined",
  "userLeft": "{username} left",
  "loading": "Loading...",
  "error": "Error",
  "retry": "Retry",
  "cancel": "Cancel",
  "confirm": "Confirm",
  "switchCamera": "Switch Camera",
  "cameraPermissionDenied": "Camera permission denied",
  "microphonePermissionDenied": "Microphone permission denied",
  "networkError": "Network error. Please check your connection.",
  "streamOffline": "This stream is offline",
  "noStreamsAvailable": "No live streams available",
  "pullToRefresh": "Pull to refresh",
  "settings": "Settings",
  "language": "Language",
  "selectLanguage": "Select Language",
  // ... 30 more strings
}
```

### Afternoon (4-5 hours)
**Multi-Language QA**
- [ ] Test all 5 languages:
  - UI fits properly (no text overflow)
  - Right-to-left support (if needed)
  - Date/time formats
  - Number formats
  - Currency formats (for future)

**In-App Language Switcher**
- [ ] Add settings screen with language selector
- [ ] Persist language preference
- [ ] Apply language without app restart
- [ ] Test switching between all 5 languages

**Final Polish**
- [ ] App icon (all sizes)
- [ ] Splash screen
- [ ] App name in all languages
- [ ] Store screenshots (5 languages)
- [ ] Final performance check

**Documentation**
- [ ] Update README with:
  - How to run
  - How to test
  - Supported languages
  - Known limitations

- [ ] Create demo video (optional)

**Deliverable**: Production-ready app with 5 languages ✅

---

## Success Criteria (End of Week 1)

### Must Have ✅
- [x] Mobile app (Android + iOS) can broadcast via RTMPS
- [x] Mobile app can view streams via HLS
- [x] H5 web can view streams
- [x] Real-time chat working
- [x] Real-time viewer count
- [x] **5 languages fully supported** (zh_TW, zh_CN, th, ja, en)
- [x] Stream list shows live status
- [x] Error handling throughout
- [x] Stable with no critical bugs

### Nice to Have 🎯
- [ ] H5 web broadcasting (WebRTC)
- [ ] Stream thumbnails
- [ ] Chat moderation
- [ ] User profiles
- [ ] Stream recording playback

### Known Limitations (Acceptable for MVP)
- No authentication yet (anonymous users)
- No product integration yet
- Basic chat (no emojis, images)
- No payment yet
- Limited analytics

---

## Team Allocation Suggestions

If you have a team, split work:

**Backend Developer** (Days 1-7)
- Cloudflare integration
- API endpoints
- WebSocket handling
- Database models
- Redis viewer tracking

**Flutter Developer 1** (Days 2-5)
- UI implementation
- Video player
- Stream list
- Localization setup

**Flutter Developer 2** (Days 3-5)
- Platform channels (RTMP)
- Camera integration
- Broadcasting UI
- Chat widget

**QA/Localization** (Days 6-7)
- Translation
- Testing all languages
- Bug reporting
- UI/UX feedback

---

## Daily Standups

**Each morning (15 min):**
1. What did I complete yesterday?
2. What will I do today?
3. Any blockers?

**Each evening (15 min):**
1. Demo what's working
2. Discuss tomorrow's priorities
3. Update task board

---

## Risk Mitigation

### High Risk
**RTMP platform channels fail**
- Backup: Use web-only (WebRTC/WHIP)
- Fallback: OBS-only for broadcasting

**Cloudflare Stream issues**
- Backup: Use test credentials
- Support: Cloudflare Discord

**Translation delays**
- Backup: Use Google Translate initially
- Polish: Native speakers review later

### Medium Risk
**Time overrun on specific features**
- Cut: Nice-to-have features
- Focus: Core streaming + viewing + 5 languages

**Device compatibility issues**
- Limit: Test on common devices only
- Document: Known device issues

---

## Tech Stack Quick Reference

**Backend:**
- FastAPI (Python)
- Cloudflare Stream API
- Cloudflare R2
- Redis (viewer count)
- WebSocket (chat)

**Frontend:**
- Flutter 3.16+
- video_player (HLS)
- Platform channels (RTMP)
- Provider (state)
- flutter_localizations (i18n)

**Infrastructure:**
- Cloudflare Stream
- Cloudflare R2
- Docker Compose (local dev)

---

## Checklist for Go-Live

- [ ] Cloudflare Stream working
- [ ] 5 languages complete
- [ ] Mobile broadcasting working
- [ ] Mobile viewing working
- [ ] Web viewing working
- [ ] Chat working
- [ ] Viewer count accurate
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Error handling graceful
- [ ] README updated
- [ ] Demo completed

---

## Next Steps After Phase 1

Once Phase 1 is complete:
- **Phase 2**: Desktop streaming (Week 2)
- **Phase 3**: Social login (Week 3-4)
- **Phase 4**: Ecommerce (Week 5-8)
- **Phase 5**: Payments (Week 9-10)

But for now, **FOCUS ON THE SPRINT!** 🚀

---

**Start Date**: ___________
**Target Completion**: 7 days later
**Status**: [ ] Not Started [ ] In Progress [ ] Complete

Good luck! 💪
