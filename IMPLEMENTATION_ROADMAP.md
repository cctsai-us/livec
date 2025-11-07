# Implementation Roadmap

This document outlines the phased implementation plan for the Live Commerce platform.

## Implementation Priority

1. **Phase 1**: Mobile app (Android, iOS, H5) - Live Streaming
2. **Phase 2**: Desktop streaming
3. **Phase 3**: Social login
4. **Phase 4**: Ecommerce
5. **Phase 5**: Payment integration

---

## Phase 1: Mobile Live Streaming (Week 1) ⚡ SPRINT

**Goal**: Create mobile apps that can broadcast and view live streams using Cloudflare Stream.
**Timeline**: 7 days
**Required Languages**: Traditional Chinese (zh_TW), Simplified Chinese (zh_CN), Thai (th), English (en), Japanese (ja)

### Day 1-2: Foundation & Cloudflare Integration

#### Backend Tasks
- [ ] Set up Cloudflare Stream account
- [ ] Implement Cloudflare Stream API integration
  - Create `backend/app/core/cloudflare_stream.py`
  - Stream creation endpoint
  - Stream status endpoint
  - Playback URL generation
- [ ] Create basic stream database models
- [ ] Implement webhook handler for stream events
- [ ] Set up R2 storage for thumbnails

**Files to implement:**
- `backend/app/core/cloudflare_stream.py`
- `backend/app/models/stream.py`
- `backend/app/schemas/stream.py`
- `backend/app/services/stream_service.py`
- `backend/app/api/v1/streams.py`

#### Frontend Tasks
- [ ] Initialize Flutter project with proper structure
- [ ] Set up API client with Dio
- [ ] Implement basic navigation
- [ ] Create theme and localization (English only first)

**Deliverables:**
- Backend can create/manage streams via Cloudflare API
- Frontend Flutter project initialized
- Basic API communication working

### Week 2: Mobile Broadcasting

#### Backend Tasks
- [ ] Implement RTMPS credential generation
- [ ] Add stream authentication
- [ ] Create viewer count tracking (Redis)
- [ ] Implement stream list endpoint

#### Frontend Tasks - Broadcasting
- [ ] Implement camera permissions handling
- [ ] Create broadcaster screen UI
- [ ] Integrate RTMP streaming library
  - iOS: HaishinKit (via platform channel)
  - Android: rtmp-rtsp-stream-client-java
- [ ] Add stream start/stop controls
- [ ] Implement stream settings (quality, camera flip)
- [ ] Add preview before going live

**Files to implement:**
- `frontend/lib/features/live_stream/presentation/screens/broadcaster_screen.dart`
- `frontend/android/app/src/main/kotlin/.../RtmpStreamingPlugin.kt`
- `frontend/ios/Runner/RtmpStreamingPlugin.swift`

**Deliverables:**
- Mobile app can broadcast to Cloudflare Stream via RTMPS
- Preview works before going live
- Stream quality controls functional

### Week 3: Mobile Viewing

#### Backend Tasks
- [ ] Implement real-time viewer count via WebSocket
- [ ] Create stream status updates
- [ ] Add basic chat WebSocket handler

#### Frontend Tasks - Viewing
- [ ] Implement HLS video player (video_player + chewie)
- [ ] Create stream viewer screen
- [ ] Display stream info (title, broadcaster, viewer count)
- [ ] Implement stream list with live/scheduled states
- [ ] Add auto-refresh for stream status
- [ ] Implement basic in-stream chat UI

**Files to implement:**
- `frontend/lib/features/live_stream/presentation/screens/viewer_screen.dart`
- `frontend/lib/features/live_stream/presentation/screens/stream_list_screen.dart`
- `frontend/lib/features/live_stream/presentation/widgets/chat_widget.dart`
- `frontend/lib/features/live_stream/presentation/widgets/viewer_count_widget.dart`
- `frontend/lib/core/network/websocket_client.dart`

**Deliverables:**
- Mobile app can view live streams via HLS
- Stream list shows live/offline status
- Basic chat working
- Viewer count displayed in real-time

### Week 4: H5 (Web) Support & Polish

#### Frontend Tasks - Web
- [ ] Test Flutter web build
- [ ] Fix web-specific issues (camera, RTMP)
- [ ] Implement web-friendly broadcasting (WebRTC if possible)
- [ ] Optimize HLS playback for web browsers
- [ ] Add responsive design for desktop browsers

#### Polish & Testing
- [ ] Add loading states and error handling
- [ ] Implement retry logic for failed connections
- [ ] Add offline mode messaging
- [ ] Write tests for core functionality
- [ ] Performance optimization
- [ ] Bug fixes

**Deliverables:**
- H5 web app working for viewing (broadcasting may be limited)
- Error handling comprehensive
- App stable for production testing

---

## Phase 2: Desktop Streaming (Week 5-6)

**Goal**: Enable desktop users to broadcast using OBS or similar tools, and view via web browser.

### Week 5: Desktop Broadcasting Support

#### Backend Tasks
- [ ] Create stream key management system
- [ ] Implement stream key rotation
- [ ] Add OBS integration documentation

#### Desktop Tasks
- [ ] Create OBS setup guide
- [ ] Test RTMPS with OBS
- [ ] Create desktop broadcaster dashboard (web)
- [ ] Implement stream manager UI
  - View stream key
  - Copy RTMPS URL
  - Start/stop stream from web
  - View analytics

**Files to create:**
- `docs/OBS_SETUP.md`
- Web dashboard (Flutter web or separate React app)

**Deliverables:**
- Users can stream from OBS to Cloudflare
- Web dashboard to manage desktop streams
- Documentation for desktop broadcasters

### Week 6: Desktop Viewing & Management

#### Web Frontend
- [ ] Optimize web viewer experience
- [ ] Add theater/fullscreen mode
- [ ] Implement keyboard shortcuts
- [ ] Add quality selector
- [ ] Create broadcaster analytics dashboard

**Deliverables:**
- Desktop viewing experience polished
- Broadcaster dashboard with analytics
- Quality selection working

---

## Phase 3: Social Login (Week 7-8)

**Goal**: Implement social authentication for all supported platforms.

### Week 7: Backend Social Auth

#### Backend Tasks
- [ ] Implement social auth providers (LINE, Facebook, Google, Apple)
- [ ] Create user account linking system
- [ ] Implement JWT token generation/validation
- [ ] Add refresh token mechanism
- [ ] Implement account merge logic

**Priority Order:**
1. LINE (most important for TW/TH)
2. Google
3. Facebook
4. Apple
5. Instagram
6. Kapook (placeholder)

**Files to implement:**
- `backend/app/core/social/line.py`
- `backend/app/core/social/google.py`
- `backend/app/core/social/facebook.py`
- `backend/app/core/social/apple.py`
- `backend/app/core/security.py` (JWT implementation)
- `backend/app/api/v1/social_auth.py`

**Deliverables:**
- All social auth providers working
- JWT authentication functional
- Account linking working

### Week 8: Frontend Social Auth

#### Frontend Tasks
- [ ] Implement LINE SDK integration
- [ ] Implement Google Sign-In
- [ ] Implement Facebook Login
- [ ] Implement Apple Sign In
- [ ] Create login screen UI
- [ ] Add social login buttons
- [ ] Implement token storage (secure)
- [ ] Add authentication state management

**Files to implement:**
- `frontend/lib/features/auth/presentation/screens/login_screen.dart`
- `frontend/lib/features/auth/presentation/screens/social_login_screen.dart`
- `frontend/lib/features/auth/data/datasources/auth_remote_datasource.dart`
- `frontend/lib/features/auth/domain/usecases/login_usecase.dart`

**Platform-specific setup:**
- Configure LINE in iOS/Android
- Configure Google Sign-In
- Configure Facebook SDK
- Configure Apple Sign In

**Deliverables:**
- All social logins working on mobile
- Secure token storage
- Auto-login on app restart
- Account management screen

---

## Phase 4: Ecommerce (Week 9-12)

**Goal**: Implement product catalog, shopping cart, and order management.

### Week 9: Product Catalog

#### Backend Tasks
- [ ] Implement product models
- [ ] Create product CRUD endpoints
- [ ] Add image upload to R2
- [ ] Implement product search
- [ ] Add categories and filters

#### Frontend Tasks
- [ ] Create product list screen
- [ ] Implement product detail screen
- [ ] Add image gallery
- [ ] Implement search functionality
- [ ] Add filters and sorting

**Deliverables:**
- Product catalog functional
- Image uploads working
- Search and filters working

### Week 10: Shopping Cart

#### Backend Tasks
- [ ] Implement cart in Redis
- [ ] Create cart endpoints
- [ ] Add cart persistence for logged-in users

#### Frontend Tasks
- [ ] Implement cart state management
- [ ] Create cart screen
- [ ] Add to cart functionality
- [ ] Update quantities
- [ ] Cart badge with count

**Deliverables:**
- Shopping cart fully functional
- Cart persists between sessions

### Week 11: Live Stream + Products Integration

#### Backend Tasks
- [ ] Link products to streams
- [ ] Implement product showcase during stream
- [ ] Create "add to cart from stream" endpoint

#### Frontend Tasks
- [ ] Add product overlay during stream
- [ ] Implement quick add to cart in stream
- [ ] Show featured products
- [ ] Product pinning by broadcaster

**Files to implement:**
- `frontend/lib/features/live_stream/presentation/widgets/product_overlay_widget.dart`

**Deliverables:**
- Products can be showcased during streams
- Viewers can buy while watching
- Seamless integration

### Week 12: Order Management

#### Backend Tasks
- [ ] Implement order models
- [ ] Create order creation endpoint
- [ ] Add order status tracking
- [ ] Implement inventory management
- [ ] Create order history endpoints

#### Frontend Tasks
- [ ] Create checkout screen
- [ ] Implement order summary
- [ ] Add order history screen
- [ ] Show order status
- [ ] Implement order details view

**Deliverables:**
- Complete order flow working
- Order tracking functional
- Inventory management in place

---

## Phase 5: Payment Integration (Week 13-14)

**Goal**: Integrate payment gateways for Taiwan and Thailand markets.

### Week 13: Payment Gateway Integration

#### Backend Tasks
- [ ] Implement ECPay integration (Taiwan)
- [ ] Implement Omise integration (Thailand)
- [ ] Create payment models
- [ ] Implement webhook handlers
- [ ] Add payment status tracking
- [ ] Implement refund logic

**Priority:**
1. ECPay (Taiwan)
2. Omise (Thailand)
3. LINE Pay (optional)

**Files to implement:**
- `backend/app/services/payment_service.py`
- `backend/app/api/v1/payments.py`
- `backend/app/api/v1/webhooks.py`

**Deliverables:**
- Payment gateways integrated
- Webhooks working
- Payment flow complete

### Week 14: Frontend Payment Flow

#### Frontend Tasks
- [ ] Create payment method selection
- [ ] Implement payment webview/redirect
- [ ] Add payment status screen
- [ ] Handle payment callbacks
- [ ] Implement payment history

#### Testing & Security
- [ ] Test all payment flows
- [ ] Verify webhook security
- [ ] Test refund process
- [ ] Security audit
- [ ] Compliance check

**Deliverables:**
- End-to-end payment working
- All payment methods tested
- Security verified

---

## Post-Launch (Week 15+)

### Optimization & Features
- [ ] Analytics and reporting
- [ ] Push notifications
- [ ] Email/SMS notifications
- [ ] Advanced search
- [ ] Recommendations
- [ ] Seller dashboard
- [ ] Admin panel
- [ ] Performance optimization
- [ ] Load testing
- [ ] Security hardening

### Localization
- [ ] Add Thai translation
- [ ] Add Traditional Chinese translation
- [ ] Test all languages

### App Store Launch
- [ ] iOS App Store submission
- [ ] Google Play submission
- [ ] App screenshots and descriptions
- [ ] Marketing materials

---

## Development Guidelines

### Daily Workflow
1. Morning standup (async or sync)
2. Work on assigned phase tasks
3. Commit code regularly
4. Run tests before committing
5. Update task status
6. End of day review

### Git Workflow
```bash
# Feature branch
git checkout -b phase1/mobile-broadcasting

# Regular commits
git add .
git commit -m "feat: implement RTMP streaming for Android"

# Push and create PR
git push origin phase1/mobile-broadcasting
```

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Widget tests for Flutter UI
- Manual testing on real devices
- Beta testing with selected users

### Documentation
- Update README as features are added
- Document API changes
- Keep architecture docs current
- Write user guides
- Create video tutorials

---

## Success Metrics

### Phase 1 Success
- [ ] Mobile app can broadcast successfully
- [ ] Mobile app can view streams
- [ ] H5 web can view streams
- [ ] 99% uptime for streaming
- [ ] < 10 second latency

### Phase 2 Success
- [ ] OBS integration working
- [ ] Desktop viewing smooth
- [ ] Analytics dashboard functional

### Phase 3 Success
- [ ] All social logins working
- [ ] < 3 seconds login time
- [ ] 100% token security

### Phase 4 Success
- [ ] Product catalog searchable
- [ ] Shopping cart functional
- [ ] Orders can be placed
- [ ] Inventory tracked

### Phase 5 Success
- [ ] Payments processing
- [ ] 0 payment failures
- [ ] Webhooks 100% reliable

---

## Risk Mitigation

### Technical Risks
- **Cloudflare Stream issues**: Have backup plan (self-hosted RTMP)
- **Mobile platform changes**: Monitor iOS/Android updates
- **Payment gateway downtime**: Implement retry logic
- **High latency**: Optimize with edge caching

### Business Risks
- **User adoption**: Beta test with real users
- **Competition**: Focus on unique features
- **Costs**: Monitor Cloudflare usage closely
- **Regulations**: Ensure compliance for TW/TH

---

## Next Steps

**Immediate (This Week):**
1. Set up Cloudflare Stream account
2. Create initial Flutter project structure
3. Implement basic Cloudflare Stream integration
4. Start Week 1 backend tasks

**Short-term (Next Month):**
1. Complete Phase 1 (Mobile live streaming)
2. Begin Phase 2 (Desktop streaming)

**Long-term (3 Months):**
1. All phases complete
2. Beta testing
3. App store submissions
4. Launch!

---

**Ready to start?** Begin with Phase 1, Week 1 tasks! 🚀
