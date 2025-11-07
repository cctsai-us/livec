"""
Instagram Login integration (via Facebook)
"""
from .base import SocialAuthProvider

class InstagramAuthProvider(SocialAuthProvider):
    """Instagram authentication provider"""

    async def get_user_info(self, access_token: str) -> dict:
        """Get Instagram user profile"""
        # TODO: Implement Instagram API integration
        pass

    async def verify_token(self, token: str) -> bool:
        """Verify Instagram access token"""
        pass
