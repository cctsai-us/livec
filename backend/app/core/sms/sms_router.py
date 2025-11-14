"""
SMS Provider Router - Routes SMS to country-specific providers
"""
from typing import Optional, Dict
import phonenumbers
from .base import SMSProvider


class SMSRouter:
    """
    Routes SMS messages to country-specific providers

    Supports:
    - Country-specific providers (e.g., Mitake for Taiwan)
    - Fallback to global provider (e.g., AWS SNS, Twilio)
    """

    def __init__(
        self,
        country_providers: Optional[Dict[str, SMSProvider]] = None,
        fallback_provider: Optional[SMSProvider] = None
    ):
        """
        Initialize SMS router

        Args:
            country_providers: Dict mapping country codes (e.g., "TW", "TH") to providers
            fallback_provider: Default provider for countries without specific provider
        """
        self.country_providers = country_providers or {}
        self.fallback_provider = fallback_provider

    def get_country_code(self, phone_number: str) -> Optional[str]:
        """
        Extract country code from phone number

        Args:
            phone_number: Phone number in E.164 format (e.g., +886912345678)

        Returns:
            ISO country code (e.g., "TW") or None if invalid
        """
        try:
            parsed = phonenumbers.parse(phone_number, None)
            country_code = phonenumbers.region_code_for_number(parsed)
            return country_code
        except Exception as e:
            print(f"[SMS ROUTER] Failed to parse phone number {phone_number}: {e}")
            return None

    def get_provider_for_phone(self, phone_number: str) -> Optional[SMSProvider]:
        """
        Get appropriate SMS provider for a phone number

        Args:
            phone_number: Phone number in E.164 format

        Returns:
            SMSProvider instance or None if no provider available
        """
        country_code = self.get_country_code(phone_number)

        if country_code and country_code in self.country_providers:
            provider = self.country_providers[country_code]
            print(f"[SMS ROUTER] Using country-specific provider for {country_code}")
            return provider

        if self.fallback_provider:
            print(f"[SMS ROUTER] Using fallback provider for country: {country_code or 'unknown'}")
            return self.fallback_provider

        print(f"[SMS ROUTER] No provider available for country: {country_code or 'unknown'}")
        return None

    async def send_sms(
        self,
        to_phone: str,
        message: str,
        from_phone: Optional[str] = None
    ) -> bool:
        """
        Route and send SMS via appropriate provider

        Args:
            to_phone: Recipient phone number in E.164 format
            message: Message content
            from_phone: Optional sender phone number

        Returns:
            bool: True if sent successfully

        Raises:
            Exception: If no provider available or sending fails
        """
        provider = self.get_provider_for_phone(to_phone)

        if not provider:
            raise Exception(f"No SMS provider available for phone number: {to_phone}")

        return await provider.send_sms(to_phone, message, from_phone)

    async def send_verification_code(
        self,
        to_phone: str,
        code: str,
        language: str = "en"
    ) -> bool:
        """
        Route and send verification code via appropriate provider

        Args:
            to_phone: Recipient phone number in E.164 format
            code: Verification code
            language: Language code for message

        Returns:
            bool: True if sent successfully
        """
        provider = self.get_provider_for_phone(to_phone)

        if not provider:
            raise Exception(f"No SMS provider available for phone number: {to_phone}")

        return await provider.send_verification_code(to_phone, code, language)
