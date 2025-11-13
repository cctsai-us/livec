"""
SMS service module
"""
from .base import SMSProvider
from .aws_sns_provider import AWSSNSProvider


def get_sms_provider(
    provider_type: str = "aws_sns",
    **kwargs
) -> SMSProvider:
    """
    Factory function to get SMS provider instance

    Args:
        provider_type: Type of provider ("aws_sns")
        **kwargs: Provider-specific configuration

    Returns:
        SMSProvider instance

    Raises:
        ValueError: If provider_type is invalid

    Example:
        # AWS SNS provider
        sms = get_sms_provider(
            "aws_sns",
            aws_access_key_id="...",
            aws_secret_access_key="...",
            region_name="us-east-1"
        )
    """
    if provider_type == "aws_sns":
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
        raise ValueError(f"Unknown SMS provider type: {provider_type}")


__all__ = [
    "SMSProvider",
    "AWSSNSProvider",
    "get_sms_provider",
]
