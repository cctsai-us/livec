"""
Backend configuration management
Loads environment-specific config from dev.py, qa.py, or prod.py
"""
from typing import Optional
import importlib

try:
    from config import env
    ENVIRONMENT = env.ENVIRONMENT
except ImportError:
    raise ImportError(
        "config/env.py not found. Please copy your environment config to config/env.py"
    )

# Dynamically import the correct environment config
try:
    env_module = importlib.import_module(f'config.{ENVIRONMENT}')
except ImportError:
    raise ImportError(
        f"config/{ENVIRONMENT}.py not found. "
        f"Create config/{ENVIRONMENT}.py with your environment variables."
    )


class BackendConfig:
    """Central configuration class - loads from environment-specific config"""

    # Application
    APP_NAME: str = "Live Commerce"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = getattr(env_module, 'DEBUG', False)
    ENVIRONMENT: str = ENVIRONMENT

    # Database
    MYSQL_HOST: str = env_module.MYSQL_HOST
    MYSQL_PORT: int = env_module.MYSQL_PORT
    MYSQL_USER: str = env_module.MYSQL_USER
    MYSQL_PASSWORD: str = env_module.MYSQL_PASSWORD
    MYSQL_DATABASE: str = env_module.MYSQL_DATABASE

    # Redis
    REDIS_HOST: str = env_module.REDIS_HOST
    REDIS_PORT: int = env_module.REDIS_PORT
    REDIS_DB: int = env_module.REDIS_DB

    # RabbitMQ
    RABBITMQ_HOST: str = env_module.RABBITMQ_HOST
    RABBITMQ_PORT: int = env_module.RABBITMQ_PORT
    RABBITMQ_USER: str = env_module.RABBITMQ_USER
    RABBITMQ_PASSWORD: str = env_module.RABBITMQ_PASSWORD

    # JWT
    SECRET_KEY: str = env_module.SECRET_KEY
    ALGORITHM: str = env_module.ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES: int = env_module.ACCESS_TOKEN_EXPIRE_MINUTES
    REFRESH_TOKEN_EXPIRE_DAYS: int = env_module.REFRESH_TOKEN_EXPIRE_DAYS

    # Cloudflare Stream
    CLOUDFLARE_ACCOUNT_ID: str = getattr(env_module, 'CLOUDFLARE_ACCOUNT_ID', '')
    CLOUDFLARE_STREAM_API_TOKEN: str = getattr(env_module, 'CLOUDFLARE_STREAM_API_TOKEN', '')
    CLOUDFLARE_STREAM_CUSTOMER_CODE: str = getattr(env_module, 'CLOUDFLARE_STREAM_CUSTOMER_CODE', '')

    # Social Auth - LINE
    LINE_CHANNEL_ID: Optional[str] = getattr(env_module, 'LINE_CHANNEL_ID', None) or None
    LINE_CHANNEL_SECRET: Optional[str] = getattr(env_module, 'LINE_CHANNEL_SECRET', None) or None

    # Social Auth - Facebook
    FACEBOOK_APP_ID: Optional[str] = getattr(env_module, 'FACEBOOK_APP_ID', None) or None
    FACEBOOK_APP_SECRET: Optional[str] = getattr(env_module, 'FACEBOOK_APP_SECRET', None) or None

    # Social Auth - Google
    GOOGLE_CLIENT_ID: Optional[str] = getattr(env_module, 'GOOGLE_CLIENT_ID', None) or None
    GOOGLE_CLIENT_SECRET: Optional[str] = getattr(env_module, 'GOOGLE_CLIENT_SECRET', None) or None

    # Social Auth - Apple
    APPLE_CLIENT_ID: Optional[str] = getattr(env_module, 'APPLE_CLIENT_ID', None) or None
    APPLE_TEAM_ID: Optional[str] = getattr(env_module, 'APPLE_TEAM_ID', None) or None
    APPLE_KEY_ID: Optional[str] = getattr(env_module, 'APPLE_KEY_ID', None) or None

    # Email & SMS
    SENDGRID_API_KEY: Optional[str] = getattr(env_module, 'SENDGRID_API_KEY', None) or None
    TWILIO_ACCOUNT_SID: Optional[str] = getattr(env_module, 'TWILIO_ACCOUNT_SID', None) or None
    TWILIO_AUTH_TOKEN: Optional[str] = getattr(env_module, 'TWILIO_AUTH_TOKEN', None) or None
    TWILIO_PHONE_NUMBER: Optional[str] = getattr(env_module, 'TWILIO_PHONE_NUMBER', None) or None

    # Storage
    S3_ENDPOINT_URL: str = getattr(env_module, 'S3_ENDPOINT_URL', '')
    S3_BUCKET_NAME: str = getattr(env_module, 'S3_BUCKET_NAME', '')
    S3_ACCESS_KEY: str = getattr(env_module, 'S3_ACCESS_KEY', '')
    S3_SECRET_KEY: str = getattr(env_module, 'S3_SECRET_KEY', '')
    S3_REGION: str = getattr(env_module, 'S3_REGION', '')

    # SMS Configuration (AWS SNS)
    SMS_PROVIDER: Optional[str] = getattr(env_module, 'SMS_PROVIDER', None) or None
    AWS_ACCESS_KEY_ID: Optional[str] = getattr(env_module, 'AWS_ACCESS_KEY_ID', None) or None
    AWS_SECRET_ACCESS_KEY: Optional[str] = getattr(env_module, 'AWS_SECRET_ACCESS_KEY', None) or None
    AWS_REGION: str = getattr(env_module, 'AWS_REGION', 'us-east-1')

    @property
    def database_url(self) -> str:
        """Construct database URL"""
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"


# Global config instance
config = BackendConfig()
