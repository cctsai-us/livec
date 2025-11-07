# API Documentation

Base URL: `http://localhost:8000/api/v1`

Interactive API documentation is available at: `http://localhost:8000/docs`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAi...",
  "refresh_token": "eyJ0eXAi...",
  "token_type": "bearer"
}
```

#### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refresh_token": "eyJ0eXAi..."
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAi...",
  "token_type": "bearer"
}
```

### Social Authentication

#### POST /auth/social/line
Login with LINE.

#### POST /auth/social/facebook
Login with Facebook.

#### POST /auth/social/google
Login with Google.

#### POST /auth/social/apple
Login with Apple.

**Request (all social endpoints):**
```json
{
  "access_token": "social_provider_token"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAi...",
  "refresh_token": "eyJ0eXAi...",
  "token_type": "bearer"
}
```

### Users

#### GET /users/me
Get current user profile. (Authenticated)

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### PUT /users/me
Update user profile. (Authenticated)

**Request:**
```json
{
  "username": "new_username"
}
```

### Live Streams

#### GET /streams
List active and scheduled streams.

**Query Parameters:**
- `skip` (int): Pagination offset (default: 0)
- `limit` (int): Items per page (default: 20)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Product Launch Live",
    "description": "Launching new products today!",
    "broadcaster_id": 10,
    "status": "live",
    "viewer_count": 150,
    "started_at": "2025-01-01T10:00:00Z"
  }
]
```

#### GET /streams/{stream_id}
Get stream details.

**Response:**
```json
{
  "id": 1,
  "title": "Product Launch Live",
  "description": "Launching new products today!",
  "broadcaster_id": 10,
  "status": "live",
  "viewer_count": 150,
  "started_at": "2025-01-01T10:00:00Z",
  "hls_url": "http://localhost:8080/hls/stream1.m3u8"
}
```

#### POST /streams
Create new stream. (Authenticated, Broadcaster only)

**Request:**
```json
{
  "title": "My Live Stream",
  "description": "Stream description",
  "scheduled_start": "2025-01-01T15:00:00Z"
}
```

#### POST /streams/{stream_id}/start
Start stream broadcast. (Authenticated, Owner only)

#### POST /streams/{stream_id}/end
End stream broadcast. (Authenticated, Owner only)

### Products

#### GET /products
List products.

**Query Parameters:**
- `skip` (int): Pagination offset
- `limit` (int): Items per page
- `category` (string): Filter by category
- `search` (string): Search query

**Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "stock": 100,
    "images": ["url1", "url2"],
    "seller_id": 5
  }
]
```

#### GET /products/{product_id}
Get product details.

#### POST /products
Create product. (Authenticated, Seller only)

**Request:**
```json
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "stock": 100
}
```

#### PUT /products/{product_id}
Update product. (Authenticated, Owner only)

#### DELETE /products/{product_id}
Delete product. (Authenticated, Owner only)

### Orders

#### GET /orders
List user orders. (Authenticated)

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "total_amount": 199.98,
    "status": "paid",
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

#### GET /orders/{order_id}
Get order details. (Authenticated)

#### POST /orders
Create order. (Authenticated)

**Request:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 99.99
    }
  ]
}
```

#### PUT /orders/{order_id}/cancel
Cancel order. (Authenticated)

### Payments

#### POST /payments
Create payment for order. (Authenticated)

**Request:**
```json
{
  "order_id": 1,
  "payment_method": "ecpay"
}
```

**Response:**
```json
{
  "id": 1,
  "order_id": 1,
  "amount": 199.98,
  "status": "pending",
  "payment_url": "https://payment-gateway.com/..."
}
```

#### GET /payments/{payment_id}/status
Check payment status. (Authenticated)

### Webhooks

#### POST /webhooks/payment/ecpay
ECPay payment webhook (Taiwan).

#### POST /webhooks/payment/omise
Omise payment webhook (Thailand).

#### POST /webhooks/payment/linepay
LINE Pay webhook.

## WebSocket Endpoints

### Chat WebSocket
**URL:** `ws://localhost:8000/ws/chat/{stream_id}`

**Message Format:**
```json
{
  "type": "message",
  "user_id": 1,
  "username": "user1",
  "content": "Hello!",
  "timestamp": "2025-01-01T10:00:00Z"
}
```

### Stream Status WebSocket
**URL:** `ws://localhost:8000/ws/stream/{stream_id}`

**Message Format:**
```json
{
  "type": "viewer_count",
  "count": 150
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Permission denied"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

API endpoints are rate limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

List endpoints support pagination:
- `skip`: Number of items to skip (default: 0)
- `limit`: Maximum items to return (default: 20, max: 100)

## Testing

Use the interactive API documentation at `http://localhost:8000/docs` to test endpoints.

For automated testing, use tools like:
- Postman
- Insomnia
- curl
- httpie
