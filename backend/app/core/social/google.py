"""
Google Sign-In integration
"""
from .base import SocialAuthProvider

class GoogleAuthProvider(SocialAuthProvider):
    """Google authentication provider"""

    async def get_user_info(self, access_token: str) -> dict:
        """Get Google user profile"""
        # TODO: Implement Google API integration
        pass

    async def verify_token(self, token: str) -> bool:
        """Verify Google ID token"""
        pass
