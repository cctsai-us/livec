"""
Apple Sign In integration
"""
from .base import SocialAuthProvider

class AppleAuthProvider(SocialAuthProvider):
    """Apple authentication provider"""

    async def get_user_info(self, access_token: str) -> dict:
        """Get Apple user information"""
        # TODO: Implement Apple Sign In integration
        pass

    async def verify_token(self, token: str) -> bool:
        """Verify Apple ID token"""
        pass
