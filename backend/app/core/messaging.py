"""
Message queue interface
"""

class MessageQueue:
    """Message queue wrapper for RabbitMQ/Redis"""

    async def publish(self, queue: str, message: dict):
        """Publish message to queue"""
        pass

    async def subscribe(self, queue: str, callback):
        """Subscribe to queue"""
        pass
