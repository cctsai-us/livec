**YOU ARE NOT ALLOWED TO MAKE ANY CHANGES OR RUN ANY CMD WITHOUT MY APPROVAL. ALWAYS PROPOSE CHANGES AND SEEK MY APPROVAL FIRST.**

# Project Context - Live Commerce Platform

**Last Updated**: 2025-11-06
**Current Phase**: Phase 1 Sprint - Day 1 (Week 1 of 7-day deadline)
**Status**: Docker services running (7/8 containers), ready for database models & Cloudflare integration

---

## Project Overview

A complete live streaming + ecommerce platform designed for Taiwan and Thailand markets.

### Key Requirements
- **Target Markets**: Taiwan and Thailand
- **Languages**: 5 languages (Traditional Chinese, Simplified Chinese, Thai, Japanese, English)
- **Phase 1 Deadline**: 7 days (1 week sprint)
- **Phase 1 Goal**: Working mobile + web live streaming app with real-time chat

### Implementation Priority
1. **Mobile app** (Android, iOS, H5) - Live streaming ← CURRENT FOCUS
2. Desktop streaming
3. Social login
4. Ecommerce
5. Payment integration

---

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MySQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ + Celery
- **Live Streaming**: **Cloudflare Stream** (RTMPS input → HLS output)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Real-time**: WebSocket (chat, viewer count)

### Frontend
- **Framework**: Flutter (cross-platform)
- **Platforms**: iOS, Android, Web (H5), Desktop
- **Video Playback**: video_player + chewie (HLS)
- **Broadcasting**: Platform channels
  - iOS: HaishinKit (RTMP)
  - Android: rtmp-rtsp-stream-client-java
- **State Management**: Provider
- **HTTP Client**: Dio

### Infrastructure
- **Development**: Docker Compose
- **Reverse Proxy**: Nginx (no RTMP - using Cloudflare)
- **CDN**: Cloudflare

---

## User's Cloudflare Credentials

**IMPORTANT**: User has completed Cloudflare setup (Step #1)

```bash
Account ID: 0255752a1330b55dad31441eb3626295
API Token: iHCD7pgd-wsNKuZO-XT-iS2iaO4MD1NqXdJ8y91L
# Customer Code: (to be obtained from dashboard)
```

These credentials are referenced in [START_HERE.md](START_HERE.md) lines 60-62.

---

## Current Progress

### ✅ Completed
1. **Project Structure Created**
   - Backend: 60+ files (FastAPI structure with placeholders)
   - Frontend: 40+ files (Flutter structure with placeholders)
   - Docs: 7 documentation files

2. **Cloudflare Migration**
   - Removed self-hosted RTMP/Nginx-RTMP
   - Updated to Cloudflare Stream
   - Created [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md)

3. **Multi-language Support**
   - Created 5 ARB files with 100 strings each:
     - [frontend/lib/l10n/app_en.arb](frontend/lib/l10n/app_en.arb)
     - [frontend/lib/l10n/app_zh_TW.arb](frontend/lib/l10n/app_zh_TW.arb)
     - [frontend/lib/l10n/app_zh_CN.arb](frontend/lib/l10n/app_zh_CN.arb)
     - [frontend/lib/l10n/app_th.arb](frontend/lib/l10n/app_th.arb)
     - [frontend/lib/l10n/app_ja.arb](frontend/lib/l10n/app_ja.arb)

4. **Sprint Planning**
   - Created [PHASE1_SPRINT_PLAN.md](PHASE1_SPRINT_PLAN.md) (7-day detailed plan)
   - Created [START_HERE.md](START_HERE.md) (quick start guide)
   - Created [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) (14-week full plan)
   - Created [SETUP_GUIDE.md](SETUP_GUIDE.md) (macOS & Ubuntu setup instructions)

5. **Cloudflare Account Setup** (Day 1 - Step #1)
   - User created Cloudflare account
   - Enabled Stream in dashboard
   - Obtained API credentials

6. **Backend Environment Setup** (Day 1 - Step #2) ✅
   - Created `backend/.env` with Cloudflare credentials
   - Updated `backend/.env.example` with Cloudflare section
   - Created conda environment `livec` with Python 3.11
   - Installed all Python dependencies (FastAPI, Cloudflare, boto3, etc.)
   - Created [backend/app/core/config.py](backend/app/core/config.py) - Pydantic Settings
   - Fixed [backend/app/tasks/celery_app.py](backend/app/tasks/celery_app.py) - Import paths

7. **Docker Services** (Day 1 - Step #2) ✅
   - Started 7 out of 8 containers successfully:
     - ✅ MySQL 8.0 (port 3306)
     - ✅ Redis 7 (port 6379)
     - ✅ RabbitMQ 3.12 (ports 5672, 15672)
     - ✅ Nginx (port 8084)
     - ✅ FastAPI API (port 8011) - **Verified working**
     - ✅ Celery Worker
     - ✅ Celery Beat
   - ❌ Flower (Celery monitoring UI) - Config issue, **optional**
   - API accessible at: http://localhost:8011/docs

### ⏳ Pending (Day 1 Tasks)
- Step #3: Create database models (`backend/app/models/stream.py`)
- Step #4: Implement Cloudflare integration (`backend/app/core/cloudflare_stream.py`)
- Step #5: Implement stream API endpoints (`backend/app/api/v1/streams.py`)
- Step #6: Test API with curl/Postman

---

## Key Files to Reference

### Essential Documentation (READ THESE FIRST!)
1. **[START_HERE.md](START_HERE.md)** ⭐ - Quick start guide with Day 1 checklist
2. **[PHASE1_SPRINT_PLAN.md](PHASE1_SPRINT_PLAN.md)** - Detailed 7-day breakdown
3. **[tech_stack.md](tech_stack.md)** - Complete technology overview
4. **[docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md)** - Cloudflare integration guide

### Configuration Files
- **[backend/.env.example](backend/.env.example)** - Environment variables template
  - ⚠️ **NOTE**: Lines 54-56 have OLD RTMP settings (need to replace with Cloudflare)
  - Missing Cloudflare credentials section (needs to be added)
- **[docker-compose.yml](docker-compose.yml)** - Docker services (updated, no RTMP)
- **[nginx/nginx.conf](nginx/nginx.conf)** - Nginx config (simplified, no RTMP)

### Backend Core Files (Placeholders)
- **[backend/app/core/cloudflare_stream.py](backend/app/core/cloudflare_stream.py)** - Cloudflare Stream API wrapper
- **[backend/app/models/stream.py](backend/app/models/stream.py)** - Stream database model
- **[backend/app/api/v1/streams.py](backend/app/api/v1/streams.py)** - Stream REST endpoints
- **[backend/app/websocket/chat_handler.py](backend/app/websocket/chat_handler.py)** - WebSocket chat

### Frontend Core Files (Placeholders)
- **[frontend/lib/features/live_stream/presentation/screens/broadcaster_screen.dart](frontend/lib/features/live_stream/presentation/screens/broadcaster_screen.dart)** - Broadcasting UI
- **[frontend/lib/features/live_stream/presentation/screens/viewer_screen.dart](frontend/lib/features/live_stream/presentation/screens/viewer_screen.dart)** - Viewing UI
- **[frontend/lib/core/network/api_client.dart](frontend/lib/core/network/api_client.dart)** - HTTP client

---

## Important Notes

### Backend .env Configuration Needs
When creating `backend/.env`, it must include:

```bash
# Cloudflare Stream (ADD THIS SECTION)
CLOUDFLARE_ACCOUNT_ID=0255752a1330b55dad31441eb3626295
CLOUDFLARE_STREAM_API_TOKEN=iHCD7pgd-wsNKuZO-XT-iS2iaO4MD1NqXdJ8y91L
CLOUDFLARE_STREAM_CUSTOMER_CODE=  # Get from Cloudflare dashboard

# Remove these OLD lines from .env.example:
# RTMP_SERVER_URL=rtmp://localhost/live
# HLS_BASE_URL=http://localhost/hls

# Replace with:
# (Cloudflare provides HLS URLs dynamically via API)
```

### Social Login Providers by Market
**Taiwan**:
- LINE (primary)
- Facebook
- Instagram
- Google
- Apple

**Thailand**:
- Facebook (primary)
- LINE
- Google
- Apple
- Kapook (placeholder - research needed)

---

## Next Immediate Steps (Day 1 Continued)

According to [START_HERE.md](START_HERE.md) Day 1 checklist:

### Morning Remaining Tasks (2-3 hours)
1. **Backend Environment Setup** (30 min)
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env to add Cloudflare credentials
   ```

2. **Install Dependencies** (15 min)
   ```bash
   pip install cloudflare boto3 httpx
   ```

3. **Start Docker Services** (15 min)
   ```bash
   cd ..
   docker-compose up -d
   docker-compose ps  # Verify all services running
   ```

4. **Create Database Models** (1-2 hours)
   - Implement `backend/app/models/stream.py`
   - Run migrations: `docker-compose exec api alembic upgrade head`

### Afternoon Tasks (4-5 hours)
5. **Implement Cloudflare Integration** (3-4 hours)
   - Create `backend/app/core/cloudflare_stream.py` with API methods
   - Implement endpoints in `backend/app/api/v1/streams.py`
   - Reference [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md) for code examples

6. **Test API** (1 hour)
   ```bash
   curl -X POST http://localhost:8000/api/v1/streams \
     -H "Content-Type: application/json" \
     -d '{"title": "Test Stream", "description": "Testing"}'
   ```

---

## User Communication Style

- User prefers concise, direct responses
- User will interrupt if explanations are too long
- User opened files in IDE to review them directly
- User expects step-by-step guidance aligned with documentation

---

## Critical Decisions Made

1. **Cloudflare Stream** over self-hosted RTMP (user requirement)
2. **1-week Phase 1** instead of 4 weeks (user requirement)
3. **5 languages** from day 1 (user requirement)
4. **Mobile-first** implementation order (user requirement)
5. **Clean Architecture** with feature-first organization
6. **Docker Compose** for local development environment

---

## Project File Structure

```
live_commerce/
├── CONTEXT.md                    # THIS FILE
├── START_HERE.md                 # Quick start guide
├── PHASE1_SPRINT_PLAN.md         # 7-day detailed plan
├── IMPLEMENTATION_ROADMAP.md     # 14-week full plan
├── tech_stack.md                 # Tech stack details
├── docker-compose.yml            # Docker services
│
├── backend/                      # FastAPI backend
│   ├── .env.example              # Template (needs Cloudflare section)
│   ├── app/
│   │   ├── api/v1/               # REST endpoints
│   │   │   └── streams.py        # Stream endpoints (placeholder)
│   │   ├── core/
│   │   │   ├── cloudflare_stream.py  # Cloudflare API (placeholder)
│   │   │   ├── config.py         # Configuration
│   │   │   └── security.py       # Auth/JWT
│   │   ├── models/
│   │   │   └── stream.py         # Stream model (placeholder)
│   │   ├── services/             # Business logic
│   │   └── websocket/
│   │       └── chat_handler.py   # Chat WebSocket (placeholder)
│   └── requirements/
│       └── base.txt              # Python dependencies
│
├── frontend/                     # Flutter app
│   ├── lib/
│   │   ├── l10n/                 # Localization files (5 languages ✅)
│   │   │   ├── app_en.arb
│   │   │   ├── app_zh_TW.arb
│   │   │   ├── app_zh_CN.arb
│   │   │   ├── app_th.arb
│   │   │   └── app_ja.arb
│   │   ├── core/
│   │   │   └── network/
│   │   │       └── api_client.dart  # HTTP client (placeholder)
│   │   └── features/
│   │       └── live_stream/
│   │           └── presentation/screens/
│   │               ├── broadcaster_screen.dart  # (placeholder)
│   │               └── viewer_screen.dart       # (placeholder)
│   └── pubspec.yaml              # Flutter dependencies
│
├── docs/
│   ├── CLOUDFLARE_SETUP.md       # Cloudflare integration guide
│   ├── CLOUDFLARE_MIGRATION_SUMMARY.md
│   └── API.md                    # API documentation (placeholder)
│
└── nginx/
    └── nginx.conf                # Simplified (no RTMP)
```

---

## When Starting a New Session

1. **Read this file first** (CONTEXT.md)
2. **Check** [START_HERE.md](START_HERE.md) for current Day/Step
3. **Review** Day 1 checklist to see what's been completed
4. **Continue** from "Next Immediate Steps" section above
5. **Reference** [PHASE1_SPRINT_PLAN.md](PHASE1_SPRINT_PLAN.md) for detailed task breakdown

---

**Remember**: Phase 1 deadline is 7 days. User has completed Day 1 Step #1 (Cloudflare setup). Currently on Day 1 Step #2 (Backend configuration).
