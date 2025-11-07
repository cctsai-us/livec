# Live Commerce Platform - Technology Stack

## Overview
A comprehensive live streaming + ecommerce platform targeting Taiwan and Thailand markets with support for iOS, Android, H5, and desktop web applications.

---

## Backend Stack

### Core Framework
- **FastAPI** (Python 3.11+)
  - High-performance async web framework
  - Built-in OpenAPI documentation
  - WebSocket support for real-time features
  - Automatic request validation with Pydantic
  - Dependency injection system

### Databases

#### MySQL 8.0+
**Purpose:** Primary relational database
- User accounts and profiles
- Product catalog
- Order management
- Payment records
- Social account links
- Stream metadata

**Features:**
- ACID compliance for transactions
- Full-text search for products
- JSON column support for flexible data
- Replication for high availability

#### Redis 7.0+
**Purpose:** Caching, session management, real-time features
- Session storage
- JWT token blacklist
- Rate limiting
- Real-time chat message caching
- Pub/Sub for WebSocket broadcasting
- Stream viewer count tracking
- Shopping cart temporary storage

### Message Queue & Background Processing

#### RabbitMQ 3.12+
**Purpose:** Message broker for distributed task processing
- Reliable message delivery
- Work queue for background tasks
- Topic exchanges for event routing
- Dead letter queues for failed tasks

**Alternative:** Redis Pub/Sub (lighter weight option)

#### Celery 5.3+
**Purpose:** Distributed task queue
- Asynchronous task processing
- Periodic task scheduling (Celery Beat)
- Task retries and error handling
- Workflow chains and groups

**Use Cases:**
- Email/SMS notifications
- Order processing
- Payment webhook handling
- Video transcoding after streams
- Analytics data aggregation
- Inventory synchronization
- Report generation

#### Celery Beat
**Purpose:** Periodic task scheduler
- Scheduled notifications
- Daily analytics reports
- Database cleanup
- Stream status checks
- Abandoned cart reminders

### ORM & Migrations
- **SQLAlchemy 2.0+** - Python SQL toolkit and ORM
- **Alembic** - Database migration tool

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **OAuth 2.0** - Social login integration
- **Bcrypt** - Password hashing
- **Python-JOSE** - JWT encoding/decoding
- **Passlib** - Password validation

### Social Login Providers

#### Taiwan Market
- **LINE Login** - Most popular messaging app
- **Facebook Login** - Social media
- **Instagram Login** - Social media (via Facebook Graph API)
- **Google Sign-In** - Email accounts
- **Apple Sign In** - iOS requirement + privacy-focused

#### Thailand Market
- **Facebook Login** - Most popular social platform
- **LINE Login** - Popular messaging app
- **Google Sign-In** - Email accounts
- **Apple Sign In** - iOS requirement
- **Kapook Login** - Local Thai portal (placeholder for integration)

### Live Streaming

#### Cloudflare Stream
- **Primary streaming solution** - Managed live streaming platform
  - Live video ingestion via RTMP/SRT/WebRTC
  - Automatic HLS/DASH delivery
  - Global CDN distribution (270+ cities)
  - Low-latency streaming (~5-10 seconds)
  - Adaptive bitrate streaming
  - Built-in DVR and recording
  - Thumbnail generation
  - Video on demand (VOD) after stream
  - Real-time analytics and viewer metrics
  - No infrastructure maintenance required
  - Pay-per-use pricing ($1/1000 minutes delivered)

**Features:**
- Stream Input: RTMP, SRT, WebRTC, WHIP
- Stream Output: HLS, DASH
- Automatic transcoding to multiple qualities
- DVR (rewind/playback during live)
- Instant replay and highlights
- Webhook notifications (stream started/ended)
- Access controls and signed URLs
- Integration with Cloudflare Workers for custom logic

#### Cloudflare R2 (Storage)
- **Video storage** - S3-compatible object storage
  - Store stream recordings
  - Product images and videos
  - User-generated content
  - No egress fees
  - Seamless integration with Cloudflare Stream

#### Video Processing (Optional)
- **FFmpeg** - For custom video manipulation (if needed)
  - Custom thumbnail generation
  - Video clipping and editing
  - Format conversion for special cases

### API & WebSocket
- **Uvicorn** - ASGI server
- **WebSocket** - Real-time bidirectional communication
  - Live chat
  - Viewer count updates
  - Product alerts during streams
  - Order notifications

### Additional Backend Libraries
- **Pydantic** - Data validation using Python type hints
- **python-multipart** - Form and file uploads
- **python-dotenv** - Environment variable management
- **aioredis** - Async Redis client
- **aiomysql** - Async MySQL client
- **httpx** - Async HTTP client for API calls
- **Pillow** - Image processing
- **python-magic** - File type detection

### Testing
- **Pytest** - Testing framework
- **pytest-asyncio** - Async test support
- **pytest-cov** - Code coverage
- **Faker** - Test data generation
- **Factory Boy** - Test fixture generation

---

## Frontend Stack

### Framework
- **Flutter 3.16+**
  - Single codebase for iOS, Android, Web
  - Native performance
  - Hot reload for fast development
  - Rich widget library
  - Excellent for real-time streaming apps

### Architecture Pattern
- **Clean Architecture** with feature-first organization
  - Separation of concerns
  - Testable code
  - Independent layers (Data, Domain, Presentation)

### State Management
- **Riverpod 2.4+** or **Provider**
  - Reactive state management
  - Compile-safe
  - Easy testing
  - Scoped providers

### HTTP Client
- **Dio 5.4+**
  - Powerful HTTP client
  - Interceptors for auth tokens
  - Request/response transformation
  - File upload/download
  - Timeout management

### WebSocket & Real-time
- **web_socket_channel** - WebSocket client
- **socket_io_client** - Socket.IO integration

### Local Storage
- **shared_preferences** - Simple key-value storage
- **hive** or **isar** - Fast local NoSQL database
- **flutter_secure_storage** - Encrypted storage for tokens

### Live Streaming (Frontend)
- **video_player** - HLS/DASH player for Cloudflare Stream
- **chewie** - Video player wrapper with controls
- **flutter_webrtc** - WebRTC for ultra-low latency (if using WHIP)
- **camera** - Camera access for broadcasting
- Custom RTMP/SRT streaming to Cloudflare Stream endpoints

### Social Authentication
- **flutter_facebook_auth** - Facebook login
- **google_sign_in** - Google authentication
- **sign_in_with_apple** - Apple authentication
- **flutter_line_sdk** - LINE login
- Custom implementation for Kapook

### UI/UX
- **cached_network_image** - Image caching
- **shimmer** - Loading placeholders
- **flutter_svg** - SVG rendering
- **lottie** - Animations
- **carousel_slider** - Image/product carousels

### Localization
- **flutter_localizations** - Built-in i18n
- **intl** - Internationalization utilities
- Support for: Thai (th), Traditional Chinese (zh_TW), English (en)

### Additional Flutter Packages
- **get_it** - Service locator (dependency injection)
- **freezed** - Code generation for immutable classes
- **json_serializable** - JSON serialization
- **logger** - Logging
- **permission_handler** - Device permissions
- **image_picker** - Camera/gallery access
- **url_launcher** - External URLs and deep links
- **share_plus** - Share functionality

---

## Infrastructure & DevOps

### Containerization
- **Docker 24+**
  - Container platform
  - Consistent environments
  - Easy deployment

- **Docker Compose**
  - Multi-container orchestration
  - Development environment
  - Service dependency management

#### Docker Containers (8 Total)

**Infrastructure Services (Always-on):**
1. **live_commerce_mysql** - MySQL 8.0 database
   - Port: 3306
   - Volume: `mysql_data` → `/var/lib/mysql`
   - Storage: Database files, tables, indexes

2. **live_commerce_redis** - Redis 7 cache
   - Port: 6379
   - Volume: `redis_data` → `/data`
   - Storage: Cache data, session data, pub/sub messages

3. **live_commerce_rabbitmq** - RabbitMQ message broker
   - Ports: 5672 (AMQP), 15672 (Management UI)
   - Volume: `rabbitmq_data` → `/var/lib/rabbitmq`
   - Storage: Message queue data, exchanges, bindings

4. **live_commerce_nginx** - Nginx reverse proxy
   - Port: 80
   - No persistent volume (config-only)
   - Usage: API proxy, WebSocket proxy

**Application Services:**
5. **live_commerce_api** - FastAPI backend
   - Port: 8000
   - Volume: `./backend` → `/app` (live reload)
   - Built from: `backend/Dockerfile`

6. **live_commerce_celery_worker** - Celery background tasks
   - No exposed ports
   - Volume: `./backend` → `/app` (shared code)
   - Built from: `backend/Dockerfile.celery`

7. **live_commerce_celery_beat** - Celery scheduler
   - No exposed ports
   - Volume: `./backend` → `/app` (shared code)
   - Built from: `backend/Dockerfile.celery`

8. **live_commerce_flower** - Celery monitoring UI
   - Port: 5555
   - Volume: `./backend` → `/app` (shared code)
   - Built from: `backend/Dockerfile.celery`

#### Docker Storage Locations

**Container Images:**
- macOS: `~/Library/Containers/com.docker.docker/Data/vms/0/`
- Linux: `/var/lib/docker/`
- Windows: `C:\ProgramData\Docker\`

**Named Volumes (Persistent Data):**
- Location (Docker VM): `/var/lib/docker/volumes/`
- Volumes created:
  - `live_commerce_mysql_data` - All MySQL database files (~500MB-50GB+)
  - `live_commerce_redis_data` - Redis AOF/RDB files (~10MB-1GB)
  - `live_commerce_rabbitmq_data` - RabbitMQ messages (~10MB-5GB)

**Bind Mounts (Development):**
- `./backend/` → `/app` in API/Celery containers (live code reload)
- `./nginx/nginx.conf` → `/etc/nginx/nginx.conf` (config file)

**Data Persistence:**
- ✅ Database data persists across container restarts
- ✅ Redis data persists (AOF mode enabled)
- ✅ RabbitMQ messages persist
- ❌ Container logs are ephemeral (use Docker logging driver for persistence)

**Volume Management Commands:**
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect live_commerce_mysql_data

# Backup volume
docker run --rm -v live_commerce_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz /data

# Remove all volumes (WARNING: DATA LOSS!)
docker-compose down -v
```

### Container Orchestration (Production)
- **Kubernetes** (optional for scale)
  - Auto-scaling
  - Load balancing
  - Self-healing
  - Rolling updates

### Web Server & Reverse Proxy
- **Nginx**
  - Reverse proxy
  - Load balancer
  - Static file serving
  - SSL termination
  - (No longer needed for RTMP - handled by Cloudflare Stream)

### CI/CD (Recommendations)
- **GitHub Actions** or **GitLab CI**
  - Automated testing
  - Docker image building
  - Deployment automation

### Monitoring & Logging
- **Flower** - Celery monitoring web UI
- **Prometheus** + **Grafana** - Metrics and visualization
- **ELK Stack** (Elasticsearch, Logstash, Kibana) - Log management
- **Sentry** - Error tracking

### Cloud Services

#### Cloudflare Platform
- **Cloudflare Stream** - Live streaming and VOD
  - Live stream ingestion and delivery
  - Recording and DVR
  - Global CDN distribution

- **Cloudflare R2** - Object storage (S3-compatible)
  - Stream recordings
  - Product images
  - User uploads (avatars, documents)
  - No egress fees

- **Cloudflare CDN** - Content delivery
  - Static assets (images, CSS, JS)
  - API response caching
  - DDoS protection
  - Web Application Firewall (WAF)

- **Cloudflare Workers** (Optional)
  - Edge computing for custom logic
  - Stream authentication
  - Video processing triggers
  - Real-time transformations

#### Communication Services
- **SendGrid** or **AWS SES** - Email delivery
- **Twilio** - SMS notifications (Thailand/Taiwan)

---

## Payment Gateways

### Taiwan Market
- **綠界科技 (ECPay)** - Most popular
- **藍新金流 (NewebPay)**
- **LINE Pay**
- **Apple Pay / Google Pay**

### Thailand Market
- **Omise** - Leading Thai payment gateway
- **2C2P**
- **PromptPay** - Thai instant payment
- **TrueMoney Wallet**
- **Apple Pay / Google Pay**

---

## Development Tools

### Code Quality
- **Black** - Python code formatter
- **Flake8** - Python linter
- **mypy** - Static type checker
- **isort** - Import sorting
- **dart analyze** - Flutter/Dart analyzer
- **dart format** - Dart code formatter

### API Development
- **Postman** or **Insomnia** - API testing
- **Swagger UI** - Auto-generated from FastAPI

### Database Tools
- **MySQL Workbench** - Database design
- **RedisInsight** - Redis GUI
- **DBeaver** - Universal database tool

### Version Control
- **Git**
- **GitHub** or **GitLab**

---

## Security Considerations

### Backend Security
- HTTPS only (TLS 1.3)
- JWT with short expiration + refresh tokens
- Rate limiting (Redis-based)
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection (FastAPI auto-escaping)
- CORS configuration
- Input validation (Pydantic)
- Password strength requirements
- Two-factor authentication (optional)

### Frontend Security
- Secure storage for tokens
- Certificate pinning (optional)
- Code obfuscation
- API key protection
- Biometric authentication support

### Infrastructure Security
- Docker security scanning
- Environment variable management
- Database access restrictions
- Firewall configuration
- Regular security updates

---

## Performance Optimization

### Backend
- Database indexing strategy
- Query optimization
- Redis caching layers
- Connection pooling
- Async/await throughout
- Background task processing

### Frontend
- Lazy loading
- Image optimization
- Code splitting
- Tree shaking
- Local caching strategy

### Streaming
- Adaptive bitrate streaming
- CDN caching
- Edge computing for low latency

---

## Scalability Strategy

### Horizontal Scaling
- Stateless API servers
- Load balancer (Nginx/AWS ALB)
- Database read replicas
- Redis cluster
- Celery worker scaling

### Vertical Scaling
- Database optimization
- Resource allocation tuning

### Microservices (Future)
- User service
- Product service
- Order service
- Stream service
- Payment service
- Notification service

---

## Development Environment Requirements

### Backend Development
- Python 3.11+
- MySQL 8.0+
- Redis 7.0+
- RabbitMQ 3.12+ (or Redis)
- Docker & Docker Compose
- Git

### Frontend Development
- Flutter SDK 3.16+
- Dart 3.2+
- Android Studio (for Android)
- Xcode (for iOS - macOS only)
- VS Code or IntelliJ IDEA
- Chrome (for web testing)

### Minimum System Requirements
- 16GB RAM (recommended)
- 4+ CPU cores
- 50GB free disk space
- macOS, Linux, or Windows

---

## Deployment Architecture

### Development
```
Docker Compose (Local)
├── API (FastAPI)
├── Celery Worker
├── Celery Beat
├── RabbitMQ
├── MySQL
├── Redis
├── Nginx (Reverse Proxy only)
└── Flower (monitoring)

Cloudflare (Cloud)
├── Stream (Live streaming)
├── R2 (Object storage)
└── CDN (Content delivery)
```

### Production (Example)
```
Application Layer
├── Load Balancer (Nginx/Cloudflare)
├── API Servers (3+ instances)
├── Celery Workers (5+ instances)
├── Celery Beat (1 instance)
├── RabbitMQ (clustered)
├── MySQL (primary + read replicas)
└── Redis (cluster)

Cloudflare Platform
├── Stream (Live video ingestion + delivery)
├── R2 (Video recordings + static assets)
├── CDN (Global distribution)
├── WAF (DDoS protection)
└── Workers (Edge computing - optional)
```

### Mobile Apps
- **iOS:** App Store distribution
- **Android:** Google Play distribution
- **Web:** Nginx static hosting + CDN

---

## Future Considerations

### Potential Additions
- **GraphQL** - Alternative to REST API
- **gRPC** - High-performance RPC
- **Apache Kafka** - Event streaming platform
- **Elasticsearch** - Full-text search at scale
- **AI/ML Features:**
  - Product recommendations
  - Content moderation
  - Personalized search
  - Chatbot support

---

## License & Third-party Services

### Required API Keys/Accounts
- Social login credentials (LINE, FB, Google, Apple, etc.)
- Payment gateway accounts (ECPay, Omise)
- **Cloudflare Account** (Stream, R2, CDN)
- SMS provider (Twilio)
- Email provider (SendGrid)

### Estimated Monthly Costs (Development)
- Cloudflare Stream: ~$1/1000 minutes delivered (~$10-50)
- Cloudflare R2: $0.015/GB stored (~$5-20)
- Email/SMS: ~$10-50
- Server hosting: ~$50-200
- **Total:** ~$75-320/month for development

### Estimated Monthly Costs (Production - Scale)

**Cloudflare Costs:**
- Stream delivery: $1/1000 minutes
  - 10,000 concurrent viewers @ 1hr = $600/month
  - 50,000 concurrent viewers @ 1hr = $3,000/month
- R2 Storage: $0.015/GB/month (no egress fees!)
  - 1TB recordings = $15/month
- CDN: Included (free with account)

**Other Services:**
- Email/SMS: ~$100-500
- Database hosting: ~$100-500
- Server hosting: ~$200-1000

**Total Estimates:**
- Small scale (< 1000 viewers): $300-800/month
- Medium scale (< 10k viewers): $800-2000/month
- Large scale (< 100k viewers): $3000-8000+/month

**Key Advantage:** No egress fees with R2 saves 90% on bandwidth costs vs AWS S3!

---

**Last Updated:** 2025-11-06
**Version:** 1.0
