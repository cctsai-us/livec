"""
Base class for social authentication providers
"""
from abc import ABC, abstractmethod

class SocialAuthProvider(ABC):
    """Base social authentication provider"""

    @abstractmethod
    async def get_user_info(self, access_token: str) -> dict:
        """Get user information from provider"""
        pass

    @abstractmethod
    async def verify_token(self, token: str) -> bool:
        """Verify access token"""
        pass
