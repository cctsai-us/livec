"""
LINE Login integration
"""
import httpx
from .base import SocialAuthProvider
from config import config

class LINEAuthProvider(SocialAuthProvider):
    """LINE authentication provider"""

    LINE_PROFILE_URL = "https://api.line.me/v2/profile"
    LINE_VERIFY_URL = "https://api.line.me/oauth2/v2.1/verify"

    async def get_user_info(self, access_token: str) -> dict:
        """Get LINE user profile"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.LINE_PROFILE_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )

            if response.status_code != 200:
                raise Exception(f"LINE API error: {response.text}")

            return response.json()

    async def verify_token(self, token: str) -> bool:
        """Verify LINE access token by fetching user profile"""
        # LINE's verify endpoint can return 403 if token format is incorrect
        # Better approach: try to fetch user profile - if successful, token is valid
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.LINE_PROFILE_URL,
                    headers={"Authorization": f"Bearer {token}"}
                )

                print(f"[LINE VERIFY] Status: {response.status_code}")
                print(f"[LINE VERIFY] Response: {response.text}")

                # If we can get profile, token is valid
                if response.status_code == 200:
                    return True

                print(f"[LINE VERIFY ERROR] Failed with status {response.status_code}")
                return False

        except Exception as e:
            print(f"[LINE VERIFY EXCEPTION] {str(e)}")
            return False
