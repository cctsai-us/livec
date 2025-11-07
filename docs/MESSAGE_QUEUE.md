# Message Queue Architecture

This document explains the message queue and background task processing architecture.

## Overview

The Live Commerce platform uses RabbitMQ + Celery for asynchronous task processing and event-driven architecture.

```
┌──────────────┐
│   FastAPI    │
│   Backend    │
└──────┬───────┘
       │ Task Queue
       ▼
┌──────────────┐     ┌──────────────┐
│  RabbitMQ    │────▶│    Celery    │
│   Broker     │     │   Workers    │
└──────────────┘     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │    Redis     │
                     │   Backend    │
                     └──────────────┘
```

## Why Message Queue?

### Benefits

1. **Asynchronous Processing**: Don't block API responses
2. **Scalability**: Scale workers independently
3. **Reliability**: Retry failed tasks automatically
4. **Decoupling**: Separate concerns between services
5. **Load Leveling**: Handle traffic spikes

### Use Cases

- Email/SMS notifications
- Payment processing
- Video transcoding
- Image processing
- Analytics aggregation
- Report generation
- Database cleanup

## Architecture Components

### RabbitMQ (Message Broker)

**Role**: Routes messages between producers and consumers

**Queues**:
- `high_priority`: Payment, orders
- `default`: Notifications, analytics
- `low_priority`: Cleanup, reports

**Exchanges**:
- `direct`: Route to specific queues
- `topic`: Pattern-based routing
- `fanout`: Broadcast to all queues

### Celery (Task Queue)

**Role**: Manages and executes background tasks

**Components**:
- **Workers**: Execute tasks
- **Beat**: Schedule periodic tasks
- **Flower**: Monitoring UI

### Redis (Result Backend)

**Role**: Store task results and state

## Task Types

### 1. Email Tasks

**File**: `backend/app/tasks/email_tasks.py`

```python
@celery_app.task
def send_welcome_email(user_email: str):
    """Send welcome email to new user"""
    # Implementation
    pass

@celery_app.task
def send_order_confirmation_email(order_id: int):
    """Send order confirmation"""
    pass
```

**Priority**: Default
**Retry**: 3 attempts, exponential backoff

### 2. SMS Tasks

**File**: `backend/app/tasks/sms_tasks.py`

```python
@celery_app.task
def send_otp_sms(phone: str, otp: str):
    """Send OTP via SMS"""
    pass

@celery_app.task
def send_order_status_sms(phone: str, order_id: int, status: str):
    """Send order status update"""
    pass
```

**Priority**: High (for OTP)
**Retry**: 2 attempts

### 3. Stream Processing Tasks

**File**: `backend/app/tasks/stream_tasks.py`

```python
@celery_app.task
def process_stream_recording(stream_id: int, video_path: str):
    """Process and transcode recorded stream"""
    # FFmpeg processing
    pass

@celery_app.task
def generate_stream_thumbnail(stream_id: int, video_path: str):
    """Generate thumbnail from stream"""
    pass
```

**Priority**: Low
**Timeout**: 1 hour (for long videos)

### 4. Order Processing Tasks

**File**: `backend/app/tasks/order_tasks.py`

```python
@celery_app.task
def process_order(order_id: int):
    """Process order after payment"""
    # Verify inventory
    # Update stock
    # Send notifications
    pass

@celery_app.task
def update_inventory(product_id: int, quantity: int):
    """Update product inventory"""
    pass
```

**Priority**: High
**Retry**: 5 attempts

### 5. Payment Tasks

**File**: `backend/app/tasks/payment_tasks.py`

```python
@celery_app.task
def process_payment_webhook(payment_id: int, webhook_data: dict):
    """Process payment gateway webhook"""
    # Verify signature
    # Update payment status
    # Trigger order processing
    pass

@celery_app.task
def retry_failed_payment(payment_id: int):
    """Retry failed payment"""
    pass
```

**Priority**: High
**Retry**: Custom retry logic

### 6. Analytics Tasks

**File**: `backend/app/tasks/analytics_tasks.py`

```python
@celery_app.task
def aggregate_stream_analytics(stream_id: int):
    """Aggregate stream analytics"""
    pass

@celery_app.task
def generate_daily_report():
    """Generate daily sales report"""
    pass
```

**Priority**: Low
**Schedule**: Periodic (Celery Beat)

## Task Workflow Examples

### Example 1: Order Creation Flow

```python
# API endpoint
@router.post("/orders")
async def create_order(order_data: OrderCreate):
    # 1. Create order in database
    order = await order_service.create_order(order_data)

    # 2. Queue inventory check (async)
    update_inventory.delay(
        product_id=order_data.product_id,
        quantity=order_data.quantity
    )

    # 3. Queue notification (async)
    send_order_confirmation_email.delay(order.id)

    # 4. Return immediately
    return order
```

### Example 2: Payment Webhook Flow

```python
# Webhook endpoint
@router.post("/webhooks/payment/ecpay")
async def ecpay_webhook(request: Request):
    # 1. Verify webhook signature
    data = await request.json()

    # 2. Queue payment processing (async)
    process_payment_webhook.delay(
        payment_id=data['payment_id'],
        webhook_data=data
    )

    # 3. Return immediately (don't make gateway wait)
    return {"status": "received"}

# Celery task
@celery_app.task
def process_payment_webhook(payment_id: int, webhook_data: dict):
    # Verify payment
    payment = verify_payment(payment_id, webhook_data)

    if payment.status == "completed":
        # Trigger order processing
        process_order.delay(payment.order_id)

        # Send confirmation
        send_payment_confirmation_email.delay(payment.user_id)
```

### Example 3: Stream End Flow

```python
# Stream end endpoint
@router.post("/streams/{stream_id}/end")
async def end_stream(stream_id: int):
    # 1. Update stream status
    stream = await stream_service.end_stream(stream_id)

    # 2. Queue video processing (async)
    process_stream_recording.delay(
        stream_id=stream.id,
        video_path=stream.recording_path
    )

    # 3. Queue analytics (async)
    aggregate_stream_analytics.delay(stream.id)

    return stream

# Celery task
@celery_app.task(bind=True, max_retries=3)
def process_stream_recording(self, stream_id: int, video_path: str):
    try:
        # Transcode video with FFmpeg
        output_path = transcode_video(video_path)

        # Generate thumbnail
        thumbnail_path = generate_thumbnail(video_path)

        # Upload to S3
        upload_to_s3(output_path, thumbnail_path)

        # Update database
        update_stream_recording(stream_id, output_path, thumbnail_path)

    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
```

## Periodic Tasks (Celery Beat)

**Configuration**: `backend/app/tasks/celery_app.py`

```python
from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    # Daily report at 2 AM
    'generate-daily-report': {
        'task': 'app.tasks.analytics_tasks.generate_daily_report',
        'schedule': crontab(hour=2, minute=0),
    },

    # Check abandoned carts every hour
    'check-abandoned-carts': {
        'task': 'app.tasks.order_tasks.check_abandoned_carts',
        'schedule': crontab(minute=0),
    },

    # Cleanup old streams every day at 3 AM
    'cleanup-old-streams': {
        'task': 'app.tasks.stream_tasks.cleanup_old_streams',
        'schedule': crontab(hour=3, minute=0),
    },
}
```

## Task Configuration

### Task Options

```python
@celery_app.task(
    bind=True,              # Pass task instance as first arg
    max_retries=3,          # Maximum retry attempts
    default_retry_delay=60, # Retry delay in seconds
    time_limit=300,         # Hard time limit (5 minutes)
    soft_time_limit=240,    # Soft time limit (4 minutes)
    priority=5,             # Task priority (0-9)
    queue='high_priority',  # Queue name
)
def my_task(self, arg1, arg2):
    pass
```

### Retry Configuration

```python
@celery_app.task(bind=True)
def my_task_with_retry(self, data):
    try:
        # Process data
        process(data)
    except RetryableError as exc:
        # Retry with exponential backoff
        raise self.retry(
            exc=exc,
            countdown=60 * (2 ** self.request.retries),
            max_retries=5
        )
    except FatalError:
        # Don't retry fatal errors
        logger.error("Fatal error occurred")
        raise
```

## Monitoring

### Flower Dashboard

Access at: `http://localhost:5555`

**Features**:
- Task history
- Worker status
- Task statistics
- Real-time monitoring

**Start Flower**:
```bash
celery -A app.tasks.celery_app flower --port=5555
```

### Task Monitoring

```python
# Check task status
result = my_task.delay(arg1, arg2)
print(result.status)  # PENDING, STARTED, SUCCESS, FAILURE

# Get task result
if result.ready():
    print(result.result)

# Wait for result (blocking)
result = result.get(timeout=10)
```

### Logging

```python
import logging

logger = logging.getLogger(__name__)

@celery_app.task
def my_task():
    logger.info("Task started")
    # Process
    logger.info("Task completed")
```

## Error Handling

### Task Failures

```python
@celery_app.task(bind=True)
def my_task(self):
    try:
        # Task logic
        pass
    except Exception as exc:
        # Log error
        logger.error(f"Task failed: {exc}")

        # Notify admin
        send_admin_notification.delay(
            subject="Task Failed",
            message=str(exc)
        )

        # Re-raise for Celery to handle
        raise
```

### Dead Letter Queue

For failed tasks that exceed retry limit:

```python
# Configure dead letter queue in RabbitMQ
# Failed tasks go to 'failed_tasks' queue for manual review
```

## Performance Optimization

### Task Chunking

For processing large datasets:

```python
from celery import group

# Split into chunks
@celery_app.task
def process_chunk(items):
    for item in items:
        process_item(item)

# Create task group
def process_all_items(items):
    chunks = [items[i:i+100] for i in range(0, len(items), 100)]
    job = group(process_chunk.s(chunk) for chunk in chunks)
    result = job.apply_async()
    return result
```

### Task Chaining

For sequential tasks:

```python
from celery import chain

# Chain tasks together
workflow = chain(
    download_video.s(url),
    process_video.s(),
    upload_to_s3.s(),
    send_notification.s()
)

result = workflow.apply_async()
```

### Task Grouping

For parallel tasks:

```python
from celery import group

# Run tasks in parallel
job = group([
    send_email.s(user1.email),
    send_email.s(user2.email),
    send_email.s(user3.email),
])

result = job.apply_async()
```

## Scaling Workers

### Add More Workers

```bash
# Start worker with custom concurrency
celery -A app.tasks.celery_app worker --concurrency=10

# Start worker for specific queue
celery -A app.tasks.celery_app worker -Q high_priority

# Start multiple workers
celery multi start worker1 worker2 worker3 -A app.tasks.celery_app
```

### Docker Scaling

```yaml
# docker-compose.yml
celery_worker:
  deploy:
    replicas: 5  # Run 5 worker instances
```

## Best Practices

1. **Keep Tasks Small**: Break large tasks into smaller chunks
2. **Idempotent Tasks**: Tasks should be safe to run multiple times
3. **Timeout Limits**: Always set time limits
4. **Error Handling**: Handle errors gracefully
5. **Logging**: Log important events
6. **Monitoring**: Monitor task performance
7. **Testing**: Test tasks independently

## Troubleshooting

### Worker Not Processing Tasks

```bash
# Check worker status
celery -A app.tasks.celery_app inspect active

# Check registered tasks
celery -A app.tasks.celery_app inspect registered

# Restart workers
docker-compose restart celery_worker
```

### Task Stuck in Pending

- Check RabbitMQ connection
- Verify worker is running
- Check task routing

### High Memory Usage

- Reduce worker concurrency
- Enable task rate limiting
- Process data in chunks

### Slow Task Execution

- Profile task code
- Optimize database queries
- Use caching
- Consider task splitting

## Further Reading

- [Celery Documentation](https://docs.celeryproject.org/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Best Practices for Celery](https://docs.celeryproject.org/en/stable/userguide/tasks.html#best-practices)
