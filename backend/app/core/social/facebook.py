"""
Facebook Login integration
"""
import httpx
from .base import SocialAuthProvider

class FacebookAuthProvider(SocialAuthProvider):
    """Facebook authentication provider"""

    FACEBOOK_GRAPH_URL = "https://graph.facebook.com/v18.0/me"

    async def get_user_info(self, access_token: str) -> dict:
        """Get Facebook user profile"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.FACEBOOK_GRAPH_URL,
                params={
                    "fields": "id,name,email,picture",
                    "access_token": access_token
                }
            )

            if response.status_code != 200:
                raise Exception(f"Facebook API error: {response.text}")

            return response.json()

    async def verify_token(self, token: str) -> bool:
        """Verify Facebook access token by fetching user profile"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.FACEBOOK_GRAPH_URL,
                    params={
                        "fields": "id",
                        "access_token": token
                    }
                )

                print(f"[FACEBOOK VERIFY] Status: {response.status_code}")
                print(f"[FACEBOOK VERIFY] Response: {response.text}")

                # If we can get profile, token is valid
                if response.status_code == 200:
                    return True

                print(f"[FACEBOOK VERIFY ERROR] Failed with status {response.status_code}")
                return False

        except Exception as e:
            print(f"[FACEBOOK VERIFY EXCEPTION] {str(e)}")
            return False
