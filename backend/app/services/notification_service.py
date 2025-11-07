"""
Notification service - business logic for notifications
"""

class NotificationService:
    async def send_email(self, to: str, subject: str, body: str):
        """Send email notification"""
        pass

    async def send_sms(self, phone: str, message: str):
        """Send SMS notification"""
        pass

    async def create_notification(self, user_id: int, notification_data: dict):
        """Create in-app notification"""
        pass

    async def get_user_notifications(self, user_id: int):
        """Get user notifications"""
        pass

    async def mark_as_read(self, notification_id: int):
        """Mark notification as read"""
        pass
