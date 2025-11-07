"""
SMS notification tasks
"""
from .celery_app import celery_app

@celery_app.task
def send_otp_sms(phone: str, otp: str):
    """Send OTP via SMS"""
    # TODO: Implement SMS sending
    pass

@celery_app.task
def send_order_status_sms(phone: str, order_id: int, status: str):
    """Send order status update SMS"""
    pass
