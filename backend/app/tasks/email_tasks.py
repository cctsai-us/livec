"""
Email notification tasks
"""
from .celery_app import celery_app

@celery_app.task
def send_welcome_email(user_email: str):
    """Send welcome email to new user"""
    # TODO: Implement email sending
    pass

@celery_app.task
def send_order_confirmation_email(order_id: int):
    """Send order confirmation email"""
    pass

@celery_app.task
def send_password_reset_email(user_email: str, reset_token: str):
    """Send password reset email"""
    pass
