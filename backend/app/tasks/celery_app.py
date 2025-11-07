"""
Celery application configuration
"""
from celery import Celery
from ..core.config import settings

celery_app = Celery(
    "live_commerce",
    broker=f"amqp://{settings.rabbitmq_user}:{settings.rabbitmq_password}@{settings.rabbitmq_host}:{settings.rabbitmq_port}//",
    backend=f"redis://{settings.redis_host}:{settings.redis_port}/1",
    include=[
        "app.tasks.email_tasks",
        "app.tasks.sms_tasks",
        "app.tasks.stream_tasks",
        "app.tasks.order_tasks",
        "app.tasks.payment_tasks",
        "app.tasks.analytics_tasks",
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
