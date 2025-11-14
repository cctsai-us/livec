"""
SMS service module
"""
from .base import SMSProvider
from .aws_sns_provider import AWSSNSProvider
from .twilio_provider import TwilioProvider
from .sms_router import SMSRouter


def get_sms_provider(
    provider_type: str = "twilio",
    **kwargs
) -> SMSProvider:
    """
    Factory function to get SMS provider instance

    Args:
        provider_type: Type of provider ("twilio", "aws_sns", "mitake", "every8d", "sms_king")
        **kwargs: Provider-specific configuration

    Returns:
        SMSProvider instance

    Raises:
        ValueError: If provider_type is invalid or missing configuration

    Examples:
        # Twilio provider
        sms = get_sms_provider(
            "twilio",
            account_sid="...",
            auth_token="...",
            from_phone="+15551234567"
        )

        # AWS SNS provider
        sms = get_sms_provider(
            "aws_sns",
            aws_access_key_id="...",
            aws_secret_access_key="...",
            region_name="us-east-1"
        )
    """
    if provider_type == "twilio":
        required_keys = ["account_sid", "auth_token", "from_phone"]
        missing_keys = [key for key in required_keys if key not in kwargs]
        if missing_keys:
            raise ValueError(f"Missing required Twilio config: {', '.join(missing_keys)}")

        return TwilioProvider(
            account_sid=kwargs["account_sid"],
            auth_token=kwargs["auth_token"],
            from_phone=kwargs["from_phone"]
        )

    elif provider_type == "aws_sns":
        required_keys = ["aws_access_key_id", "aws_secret_access_key"]
        missing_keys = [key for key in required_keys if key not in kwargs]
        if missing_keys:
            raise ValueError(f"Missing required AWS SNS config: {', '.join(missing_keys)}")

        return AWSSNSProvider(
            aws_access_key_id=kwargs["aws_access_key_id"],
            aws_secret_access_key=kwargs["aws_secret_access_key"],
            region_name=kwargs.get("region_name", "us-east-1")
        )

    else:
        raise ValueError(
            f"Unknown SMS provider type: {provider_type}. "
            f"Supported providers: twilio, aws_sns, mitake, every8d, sms_king"
        )


def create_sms_router_from_config(config) -> SMSRouter:
    """
    Create SMS router with country-specific providers from configuration

    Args:
        config: Backend configuration object (BackendConfig instance)

    Returns:
        SMSRouter instance configured with country-specific providers
    """
    from typing import Dict

    country_providers: Dict[str, SMSProvider] = {}
    fallback_provider = None

    # Get country routing configuration
    country_routing = getattr(config, 'SMS_COUNTRY_ROUTING', {})
    fallback_provider_name = getattr(config, 'SMS_FALLBACK_PROVIDER', 'twilio')

    # Create providers for each country based on routing config
    provider_instances = {}  # Cache provider instances

    for country_code, provider_name in country_routing.items():
        if provider_name not in provider_instances:
            # Create provider instance
            try:
                if provider_name == "twilio":
                    if config.TWILIO_ACCOUNT_SID and config.TWILIO_AUTH_TOKEN and config.TWILIO_PHONE_NUMBER:
                        provider_instances[provider_name] = get_sms_provider(
                            "twilio",
                            account_sid=config.TWILIO_ACCOUNT_SID,
                            auth_token=config.TWILIO_AUTH_TOKEN,
                            from_phone=config.TWILIO_PHONE_NUMBER
                        )
                elif provider_name == "aws_sns":
                    if config.AWS_ACCESS_KEY_ID and config.AWS_SECRET_ACCESS_KEY:
                        provider_instances[provider_name] = get_sms_provider(
                            "aws_sns",
                            aws_access_key_id=config.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
                            region_name=config.AWS_REGION
                        )
                # Add more providers as they are implemented
                # elif provider_name == "mitake":
                #     ...
            except ValueError as e:
                print(f"[SMS ROUTER] Failed to create {provider_name} provider: {e}")

        # Assign provider to country
        if provider_name in provider_instances:
            country_providers[country_code] = provider_instances[provider_name]

    # Create fallback provider
    if fallback_provider_name in provider_instances:
        fallback_provider = provider_instances[fallback_provider_name]
    else:
        # Try to create fallback provider
        try:
            if fallback_provider_name == "twilio":
                if config.TWILIO_ACCOUNT_SID and config.TWILIO_AUTH_TOKEN and config.TWILIO_PHONE_NUMBER:
                    fallback_provider = get_sms_provider(
                        "twilio",
                        account_sid=config.TWILIO_ACCOUNT_SID,
                        auth_token=config.TWILIO_AUTH_TOKEN,
                        from_phone=config.TWILIO_PHONE_NUMBER
                    )
            elif fallback_provider_name == "aws_sns":
                if config.AWS_ACCESS_KEY_ID and config.AWS_SECRET_ACCESS_KEY:
                    fallback_provider = get_sms_provider(
                        "aws_sns",
                        aws_access_key_id=config.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
                        region_name=config.AWS_REGION
                    )
        except ValueError as e:
            print(f"[SMS ROUTER] Failed to create fallback provider {fallback_provider_name}: {e}")

    return SMSRouter(
        country_providers=country_providers,
        fallback_provider=fallback_provider
    )


__all__ = [
    "SMSProvider",
    "AWSSNSProvider",
    "TwilioProvider",
    "SMSRouter",
    "get_sms_provider",
    "create_sms_router_from_config",
]
