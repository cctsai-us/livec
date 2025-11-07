"""
Redis client configuration
"""
import redis.asyncio as redis
from ..config import settings

class RedisClient:
    def __init__(self):
        self.redis = None

    async def connect(self):
        """Connect to Redis"""
        self.redis = await redis.from_url(
            f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
            encoding="utf-8",
            decode_responses=True
        )

    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()

    async def get(self, key: str):
        """Get value from Redis"""
        return await self.redis.get(key)

    async def set(self, key: str, value: str, expire: int = None):
        """Set value in Redis"""
        await self.redis.set(key, value, ex=expire)

    async def delete(self, key: str):
        """Delete key from Redis"""
        await self.redis.delete(key)

redis_client = RedisClient()
