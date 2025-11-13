"""
Abstract SMS service interface
"""
from abc import ABC, abstractmethod
from typing import Optional


class SMSProvider(ABC):
    """Abstract base class for SMS providers"""

    @abstractmethod
    async def send_sms(
        self,
        to_phone: str,
        message: str,
        from_phone: Optional[str] = None
    ) -> bool:
        """
        Send an SMS message

        Args:
            to_phone: Recipient phone number in E.164 format (e.g., +886912345678)
            message: Message content to send
            from_phone: Optional sender phone number

        Returns:
            bool: True if message was sent successfully, False otherwise

        Raises:
            Exception: If SMS sending fails
        """
        pass

    @abstractmethod
    async def send_verification_code(
        self,
        to_phone: str,
        code: str,
        language: str = "en"
    ) -> bool:
        """
        Send a verification code SMS

        Args:
            to_phone: Recipient phone number in E.164 format
            code: Verification code to send
            language: Language code for the message (en, zh_TW, zh_CN, th, ja)

        Returns:
            bool: True if message was sent successfully, False otherwise
        """
        pass

    def _format_verification_message(self, code: str, language: str = "en") -> str:
        """
        Format verification code message based on language

        Args:
            code: Verification code
            language: Language code

        Returns:
            str: Formatted message
        """
        messages = {
            "en": f"Your Live Commerce verification code is: {code}. Valid for 10 minutes.",
            "zh_TW": f"您的直播商城驗證碼是：{code}。有效期限10分鐘。",
            "zh_CN": f"您的直播商城验证码是：{code}。有效期限10分钟。",
            "th": f"รหัสยืนยัน Live Commerce ของคุณคือ: {code} มีอายุ 10 นาที",
            "ja": f"Live Commerce認証コードは {code} です。10分間有効です。"
        }
        return messages.get(language, messages["en"])
