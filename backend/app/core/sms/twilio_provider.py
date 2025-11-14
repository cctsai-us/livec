"""
Twilio SMS Provider Implementation
Documentation: https://www.twilio.com/docs/sms
"""
from typing import Optional
import aiohttp
import base64
from .base import SMSProvider


class TwilioProvider(SMSProvider):
    """
    Twilio SMS Provider for international SMS
    Works immediately with no sandbox restrictions (after trial)
    """

    def __init__(
        self,
        account_sid: str,
        auth_token: str,
        from_phone: str
    ):
        """
        Initialize Twilio SMS provider

        Args:
            account_sid: Twilio Account SID
            auth_token: Twilio Auth Token
            from_phone: Twilio phone number (e.g., +15551234567)
        """
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.from_phone = from_phone
        self.api_url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"

        print(f"[TWILIO] Provider initialized")
        print(f"[TWILIO] Account SID: {account_sid[:8]}...")
        print(f"[TWILIO] From phone: {from_phone}")

    def _get_auth_header(self) -> str:
        """Generate HTTP Basic Auth header for Twilio API"""
        credentials = f"{self.account_sid}:{self.auth_token}"
        encoded = base64.b64encode(credentials.encode()).decode()
        return f"Basic {encoded}"

    async def send_sms(
        self,
        to_phone: str,
        message: str,
        from_phone: Optional[str] = None
    ) -> bool:
        """
        Send SMS via Twilio API

        Args:
            to_phone: Recipient phone number in E.164 format (e.g., +886912345678)
            message: Message content (max 160 chars for single SMS)
            from_phone: Override sender phone (optional, uses default if not provided)

        Returns:
            bool: True if sent successfully

        Raises:
            Exception: If SMS sending fails
        """
        try:
            sender = from_phone or self.from_phone

            # Prepare request data
            data = {
                'From': sender,
                'To': to_phone,
                'Body': message
            }

            headers = {
                'Authorization': self._get_auth_header(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }

            # Send HTTP POST request to Twilio API
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.api_url,
                    data=data,
                    headers=headers
                ) as response:
                    response_json = await response.json()

                    if response.status == 201:
                        # Success
                        message_sid = response_json.get('sid')
                        status = response_json.get('status')

                        print(f"[TWILIO] Message sent successfully")
                        print(f"[TWILIO] Message SID: {message_sid}")
                        print(f"[TWILIO] Status: {status}")
                        print(f"[TWILIO] To: {to_phone}")

                        return True
                    else:
                        # Error
                        error_code = response_json.get('code')
                        error_message = response_json.get('message', 'Unknown error')

                        print(f"[TWILIO ERROR] Failed to send SMS")
                        print(f"[TWILIO ERROR] Status: {response.status}")
                        print(f"[TWILIO ERROR] Code: {error_code}")
                        print(f"[TWILIO ERROR] Message: {error_message}")

                        raise Exception(f"Twilio SMS failed: {error_message}")

        except Exception as e:
            print(f"[TWILIO ERROR] Unexpected error: {e}")
            raise Exception(f"SMS sending failed: {str(e)}")

    async def send_verification_code(
        self,
        to_phone: str,
        code: str,
        language: str = "en"
    ) -> bool:
        """
        Send verification code via Twilio

        Args:
            to_phone: Recipient phone number in E.164 format
            code: Verification code
            language: Language code for message

        Returns:
            bool: True if sent successfully
        """
        message = self._format_verification_message(code, language)

        print(f"[TWILIO] Sending verification code")
        print(f"[TWILIO] To: {to_phone}")
        print(f"[TWILIO] Language: {language}")

        return await self.send_sms(to_phone, message)
