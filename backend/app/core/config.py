from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "Live Commerce"
    debug: bool = True

    # Database
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = "password"
    mysql_database: str = "live_commerce"

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0

    # RabbitMQ
    rabbitmq_host: str = "localhost"
    rabbitmq_port: int = 5672
    rabbitmq_user: str = "guest"
    rabbitmq_password: str = "guest"

    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Cloudflare Stream
    cloudflare_account_id: Optional[str] = None
    cloudflare_stream_api_token: Optional[str] = None
    cloudflare_stream_customer_code: Optional[str] = None

    # Social Authentication - LINE
    line_channel_id: Optional[str] = None
    line_channel_secret: Optional[str] = None

    # Social Authentication - Facebook
    facebook_app_id: Optional[str] = None
    facebook_app_secret: Optional[str] = None

    # Social Authentication - Google
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None

    # Social Authentication - Apple
    apple_client_id: Optional[str] = None
    apple_team_id: Optional[str] = None
    apple_key_id: Optional[str] = None

    # Email (SendGrid)
    sendgrid_api_key: Optional[str] = None

    # SMS (Twilio)
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_phone_number: Optional[str] = None

    # Cloudflare R2 Storage (S3-compatible)
    s3_endpoint_url: Optional[str] = None
    s3_bucket_name: Optional[str] = None
    s3_access_key: Optional[str] = None
    s3_secret_key: Optional[str] = None
    s3_region: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra environment variables


# Global settings instance
settings = Settings()
