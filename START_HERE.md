# 🚀 START HERE - Live Commerce Platform

## Welcome!

This is your complete live streaming + ecommerce platform designed for Taiwan and Thailand markets.

---

## ⚡ Phase 1 Sprint - 1 WEEK DEADLINE

**Goal**: Working mobile + web live streaming app with 5 languages

### What You're Building (Week 1)
- ✅ Mobile broadcasting (Android + iOS via RTMPS)
- ✅ Mobile viewing (HLS video player)
- ✅ H5 web viewing
- ✅ Real-time chat
- ✅ Viewer count tracking
- ✅ **5 Languages**: 🇹🇼 Traditional Chinese, 🇨🇳 Simplified Chinese, 🇹🇭 Thai, 🇯🇵 Japanese, 🇬🇧 English

---

## 📚 Key Documents (READ THESE FIRST!)

### 1. **[PHASE1_SPRINT_PLAN.md](PHASE1_SPRINT_PLAN.md)** ⭐ START HERE
   - Day-by-day breakdown (7 days)
   - Detailed tasks for each day
   - Success criteria
   - Team allocation

### 2. **[tech_stack.md](tech_stack.md)**
   - Complete technology overview
   - Cloudflare Stream setup
   - All dependencies
   - Cost estimates

### 3. **[docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md)**
   - Cloudflare Stream integration guide
   - Code examples (Python + Flutter)
   - API reference
   - Troubleshooting

### 4. **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)**
   - Full 14-week plan (all phases)
   - Phase 2-5 overview
   - Long-term vision

---

## 🎯 Day 1 Quick Start (TODAY!)

### Morning Tasks (4-5 hours)

**1. Cloudflare Setup** (30 min)
```bash
# 1. Create account: https://dash.cloudflare.com/sign-up
# 2. Enable Stream in dashboard
# 3. Create R2 bucket: "live-commerce-storage"
# 4. Get credentials:
#    - Account ID: 0255752a1330b55dad31441eb3626295
#    - API Token (Stream Edit permissions): iHCD7pgd-wsNKuZO-XT-iS2iaO4MD1NqXdJ8y91L
#    - Customer Code
# // Get your Account ID first
# // Go to: Dashboard → Click your account name → Copy Account ID

# const accountId = 'YOUR_ACCOUNT_ID';
# const apiToken = 'YOUR_NEW_TOKEN';

# // Create a live input
# const response = await fetch(
#   `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`,
#   {
#     method: 'POST',
#     headers: {
#       'Authorization': `Bearer ${apiToken}`,
#       'Content-Type': 'application/json',
#     },
#     body: JSON.stringify({
#       meta: { 
#         name: 'Thailand Product Live Stream'
#       },
#       recording: {
#         mode: 'automatic',  // Saves recording after stream ends
#         timeoutSeconds: 10  // Stops recording 10 seconds after stream ends
#       }
#     })
#   }
# );

# const data = await response.json();
# console.log(data.result);
```

**2. Backend Setup** (2-3 hours)
```bash
cd backend

# Create .env file
cp .env.example .env

# Add Cloudflare credentials to .env:
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_STREAM_API_TOKEN=your_api_token
CLOUDFLARE_STREAM_CUSTOMER_CODE=your_customer_code

# Install dependencies
pip install cloudflare boto3 httpx

# Start Docker services
cd ..
docker-compose up -d

# Verify services running
docker-compose ps
```

**3. Create Database Models** (1-2 hours)
- Implement `backend/app/models/stream.py`
- Run migrations: `docker-compose exec api alembic upgrade head`

### Afternoon Tasks (4-5 hours)

**4. Implement Cloudflare Integration** (3-4 hours)
- Create `backend/app/core/cloudflare_stream.py`
- Implement stream endpoints in `backend/app/api/v1/streams.py`
- Test with curl/Postman

**5. Test API** (1 hour)
```bash
# Create a test stream
curl -X POST http://localhost:8000/api/v1/streams \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Stream", "description": "Testing"}'

# Should return RTMPS URL and stream key!
```

---

## 📱 Languages Configured (All 5!)

### Localization Files Created ✅
- `frontend/lib/l10n/app_en.arb` - English (100 strings)
- `frontend/lib/l10n/app_zh_TW.arb` - 繁體中文 (100 strings)
- `frontend/lib/l10n/app_zh_CN.arb` - 简体中文 (100 strings)
- `frontend/lib/l10n/app_th.arb` - ไทย (100 strings)
- `frontend/lib/l10n/app_ja.arb` - 日本語 (100 strings)

### To Generate Localization Code
```bash
cd frontend
flutter gen-l10n
```

All UI strings are ready! Just use:
```dart
Text(AppLocalizations.of(context)!.liveNow)  // Shows: LIVE NOW / 正在直播 / กำลังถ่ายทอดสด etc.
```

---

## 🛠 Tech Stack Overview

### Backend
- **FastAPI** (Python) - API server
- **Cloudflare Stream** - Live streaming (RTMP → HLS)
- **Cloudflare R2** - Object storage (recordings, images)
- **MySQL** - Database
- **Redis** - Cache + real-time viewer count
- **RabbitMQ** - Message queue
- **WebSocket** - Real-time chat

### Frontend
- **Flutter** - Cross-platform (iOS, Android, Web)
- **video_player + chewie** - HLS playback
- **Platform channels** - RTMP broadcasting (iOS: HaishinKit, Android: rtmp-rtsp-stream-client-java)
- **Provider** - State management
- **Dio** - HTTP client

### Infrastructure
- **Docker Compose** - Local development
- **Nginx** - Reverse proxy
- **Cloudflare CDN** - Global delivery

---

## 📁 Project Structure

```
live_commerce/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Cloudflare, security
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── websocket/      # WebSocket handlers
│   └── requirements/       # Python dependencies
│
├── frontend/               # Flutter app
│   ├── lib/
│   │   ├── features/       # Feature modules
│   │   ├── core/           # Network, storage
│   │   └── l10n/           # 5 language files ✅
│   └── pubspec.yaml        # Flutter dependencies
│
├── docs/                   # Documentation
│   ├── CLOUDFLARE_SETUP.md
│   ├── API.md
│   └── ...
│
├── PHASE1_SPRINT_PLAN.md   # ⭐ YOUR ROADMAP
├── tech_stack.md
└── docker-compose.yml
```

---

## ✅ Daily Checklist Template

### Day 1 ✅ COMPLETE
- [x] Cloudflare account created
- [x] Stream API working
- [x] Backend can create streams
- [x] Test stream created successfully

### Day 2 ✅ COMPLETE
- [x] Flutter project set up (Flutter 3.35.7 installed, dependencies resolved)
- [x] 5 languages configured (l10n code generated successfully)
- [x] API client implemented (Stream models, StreamApiService with 8 methods)
- [x] Can call backend from Flutter (all tests passed: list, create, get, credentials, playback)

### Day 3 ✓
- [ ] RTMP platform channels created
- [ ] Camera preview working
- [ ] Broadcasting to Cloudflare works

### Day 4 ✓
- [ ] HLS video player working
- [ ] Stream list shows live streams
- [ ] Chat working
- [ ] Viewer count updating

### Day 5 ✓
- [ ] Web build working
- [ ] Responsive design done
- [ ] Loading states everywhere
- [ ] Error handling complete

### Day 6 ✓
- [ ] All testing complete
- [ ] Critical bugs fixed
- [ ] Performance optimized

### Day 7 ✓
- [ ] All 5 languages QA'd
- [ ] Language switcher working
- [ ] Documentation updated
- [ ] READY FOR DEMO! 🎉

---

## 🆘 Need Help?

### Documentation
- [Cloudflare Stream Docs](https://developers.cloudflare.com/stream/)
- [Flutter Documentation](https://docs.flutter.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

### Support
- Cloudflare Discord: [https://discord.gg/cloudflaredev](https://discord.gg/cloudflaredev)
- Flutter Discord: [https://discord.gg/flutter](https://discord.gg/flutter)

### Common Issues
See [docs/CLOUDFLARE_SETUP.md#troubleshooting](docs/CLOUDFLARE_SETUP.md#troubleshooting)

---

## 🎬 After Phase 1 (Week 2+)

Once you complete the 1-week sprint:
- **Week 2**: Desktop streaming (OBS integration)
- **Week 3-4**: Social login (LINE, Facebook, Google, Apple, etc.)
- **Week 5-8**: Ecommerce (products, cart, orders)
- **Week 9-10**: Payments (ECPay, Omise)

But for now... **FOCUS ON PHASE 1!** ⚡

---

## 🚀 Ready? Let's Go!

1. ✅ Read [PHASE1_SPRINT_PLAN.md](PHASE1_SPRINT_PLAN.md)
2. ✅ Start Day 1 tasks
3. ✅ Update checklist daily
4. ✅ Ship in 7 days!

**You got this!** 💪

---

**Project Status**: Phase 1 Sprint (Day 2 Complete ✅ - Ready for Day 3)
**Deadline**: 6 days remaining
**Languages**: 5 (en, zh_TW, zh_CN, th, ja) ✅ L10n code generated
**Backend Connection**: ✅ Verified - All API endpoints working
**Target**: Working live streaming app on mobile + web
