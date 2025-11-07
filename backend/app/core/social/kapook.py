"""
Kapook Login integration (Thailand) - Placeholder
"""
from .base import SocialAuthProvider

class KapookAuthProvider(SocialAuthProvider):
    """Kapook authentication provider (placeholder)"""

    async def get_user_info(self, access_token: str) -> dict:
        """Get Kapook user profile"""
        # TODO: Implement Kapook API integration when available
        pass

    async def verify_token(self, token: str) -> bool:
        """Verify Kapook access token"""
        pass
