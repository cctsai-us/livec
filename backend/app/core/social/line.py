"""
LINE Login integration
"""
from .base import SocialAuthProvider

class LINEAuthProvider(SocialAuthProvider):
    """LINE authentication provider"""

    async def get_user_info(self, access_token: str) -> dict:
        """Get LINE user profile"""
        # TODO: Implement LINE API integration
        pass

    async def verify_token(self, token: str) -> bool:
        """Verify LINE access token"""
        pass
