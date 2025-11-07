# System Architecture

## Overview

Live Commerce is a microservices-based platform built with a layered architecture pattern, separating concerns between presentation, business logic, and data layers.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   iOS    │  │  Android │  │    Web   │  │ Desktop │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTPS/WSS
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  Nginx (Reverse Proxy)                   │
│                  + RTMP Streaming Server                 │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   FastAPI   │  │  WebSocket  │  │ RTMP Stream │
│   Backend   │  │   Handler   │  │   Handler   │
└──────┬──────┘  └──────┬──────┘  └─────────────┘
       │                │
       │                │
       ▼                ▼
┌─────────────────────────────────────┐
│        Business Logic Layer          │
│  ┌─────────────────────────────┐   │
│  │  Services                    │   │
│  │  - User Service              │   │
│  │  - Product Service           │   │
│  │  - Stream Service            │   │
│  │  - Order Service             │   │
│  │  - Payment Service           │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
┌──────────┐ ┌─────┐ ┌──────────┐
│  MySQL   │ │Redis│ │ RabbitMQ │
└──────────┘ └─────┘ └────┬─────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Celery    │
                    │   Workers   │
                    └─────────────┘
```

## Component Architecture

### Backend Architecture

```
backend/
├── API Layer (FastAPI)
│   ├── REST Endpoints
│   ├── WebSocket Endpoints
│   └── Request Validation
│
├── Core Layer
│   ├── Security (JWT, OAuth)
│   ├── Social Auth Providers
│   ├── Streaming Manager
│   └── Message Queue
│
├── Service Layer
│   ├── Business Logic
│   ├── Data Validation
│   └── External API Integration
│
├── Data Layer
│   ├── Models (SQLAlchemy)
│   ├── Schemas (Pydantic)
│   └── Database Sessions
│
└── Task Layer (Celery)
    ├── Background Jobs
    ├── Scheduled Tasks
    └── Event Handlers
```

### Frontend Architecture (Flutter)

```
Clean Architecture Pattern:

┌─────────────────────────────────────┐
│       Presentation Layer             │
│  ┌──────────┐  ┌────────────────┐  │
│  │ Screens  │  │    Widgets     │  │
│  └──────────┘  └────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │    State Management          │  │
│  │    (Provider/Riverpod)       │  │
│  └──────────────────────────────┘  │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│         Domain Layer                 │
│  ┌──────────┐  ┌────────────────┐  │
│  │ Entities │  │   Use Cases    │  │
│  └──────────┘  └────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Repository Interfaces       │  │
│  └──────────────────────────────┘  │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│          Data Layer                  │
│  ┌──────────┐  ┌────────────────┐  │
│  │  Models  │  │  Data Sources  │  │
│  └──────────┘  └────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Repository Implementations  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Data Flow

### User Authentication Flow
```
1. User → Frontend → API /auth/login
2. API validates credentials
3. API generates JWT tokens
4. Frontend stores tokens securely
5. Frontend includes token in subsequent requests
```

### Live Streaming Flow
```
1. Broadcaster creates stream → POST /streams
2. API generates RTMP stream key
3. Broadcaster starts streaming to RTMP server
4. Nginx transcodes stream to HLS
5. Viewers connect via WebSocket
6. Frontend plays HLS stream
7. Chat messages broadcast via WebSocket
```

### Order Processing Flow
```
1. User adds products to cart (local storage)
2. User checkout → POST /orders
3. API creates order → queues inventory check task
4. Celery worker validates inventory
5. User initiates payment → POST /payments
6. API redirects to payment gateway
7. Payment gateway webhook → /webhooks/payment
8. Celery worker processes payment
9. Order status updated → notification sent
```

## Database Schema

### Core Tables

**users**
- id (PK)
- email
- username
- hashed_password
- role (user, seller, admin)
- is_active
- created_at, updated_at

**social_accounts**
- id (PK)
- user_id (FK)
- provider (line, facebook, google, etc.)
- provider_user_id
- access_token
- refresh_token

**products**
- id (PK)
- seller_id (FK)
- name
- description
- price
- stock
- images (JSON)
- category_id (FK)
- created_at, updated_at

**streams**
- id (PK)
- broadcaster_id (FK)
- title
- description
- stream_key
- status (scheduled, live, ended)
- scheduled_start
- started_at, ended_at

**orders**
- id (PK)
- user_id (FK)
- total_amount
- status (pending, paid, shipped, delivered, cancelled)
- created_at, updated_at

**order_items**
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity
- price

**payments**
- id (PK)
- order_id (FK)
- amount
- payment_method
- status (pending, completed, failed)
- transaction_id
- gateway_response (JSON)

## Message Queue Architecture

### Celery Tasks

**Email Tasks**
- send_welcome_email
- send_order_confirmation_email
- send_password_reset_email

**Stream Tasks**
- process_stream_recording
- generate_stream_thumbnail
- cleanup_old_streams

**Order Tasks**
- process_order
- update_inventory
- check_abandoned_carts

**Payment Tasks**
- process_payment_webhook
- retry_failed_payment
- process_refund

**Analytics Tasks**
- aggregate_stream_analytics
- generate_daily_report
- calculate_seller_metrics

### Task Queues
- **high_priority**: Payment processing, order creation
- **default**: Email notifications, analytics
- **low_priority**: Cleanup tasks, reports

## Caching Strategy

### Redis Cache Layers

**L1: Hot Data (TTL: 5-10 minutes)**
- Active stream viewer counts
- Product list (first page)
- User sessions

**L2: Warm Data (TTL: 1 hour)**
- Product details
- User profiles
- Category lists

**L3: Cold Data (TTL: 24 hours)**
- Static content
- Configuration

### Cache Invalidation
- **Write-through**: Update cache on write
- **Event-based**: Invalidate on specific events
- **TTL-based**: Automatic expiration

## Security Architecture

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Social OAuth 2.0 integration
- Refresh token rotation

### Data Security
- Password hashing with bcrypt
- Encrypted token storage
- HTTPS/TLS for all communications
- SQL injection prevention (ORM)
- XSS protection

### API Security
- Rate limiting (Redis-based)
- CORS configuration
- Input validation
- API key authentication (for webhooks)

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (scale with load balancer)
- Celery workers (scale independently)
- MySQL read replicas
- Redis cluster

### Vertical Scaling
- Database optimization (indexes, query optimization)
- Connection pooling
- Async I/O throughout

### Future Microservices
When scale requires:
- User Service
- Product Service
- Order Service
- Stream Service
- Payment Service
- Notification Service

## Monitoring & Logging

### Application Monitoring
- API response times
- Error rates
- Active connections
- Task queue lengths

### Infrastructure Monitoring
- Database performance
- Redis memory usage
- Celery worker health
- Nginx metrics

### Logging Strategy
- Structured logging (JSON)
- Log levels (DEBUG, INFO, WARNING, ERROR)
- Centralized logging (ELK stack)
- Log rotation

## Disaster Recovery

### Backup Strategy
- Daily MySQL backups
- Redis persistence (AOF + RDB)
- Stream recording backups to S3

### High Availability
- Database replication
- Redis sentinel
- RabbitMQ clustering
- Multi-region deployment (future)

## Performance Optimization

### Backend
- Database query optimization
- Eager loading for relationships
- Response compression (gzip)
- CDN for static assets

### Frontend
- Image lazy loading
- Code splitting
- Local caching
- Optimistic UI updates

### Streaming
- Adaptive bitrate streaming
- CDN for HLS delivery
- Edge caching
