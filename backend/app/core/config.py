"""
Backward compatibility config wrapper
Imports from backend/config/dev.py|qa.py|prod.py based on ENVIRONMENT
"""
from config import config as backend_config


class Settings:
    """Settings wrapper for backward compatibility with old code"""

    # Application
    @property
    def app_name(self):
        return getattr(backend_config, 'APP_NAME', 'Live Commerce')

    @property
    def debug(self):
        return backend_config.DEBUG

    @property
    def api_base_url(self):
        return backend_config.API_BASE_URL

    # Database
    @property
    def mysql_host(self):
        return backend_config.MYSQL_HOST

    @property
    def mysql_port(self):
        return backend_config.MYSQL_PORT

    @property
    def mysql_user(self):
        return backend_config.MYSQL_USER

    @property
    def mysql_password(self):
        return backend_config.MYSQL_PASSWORD

    @property
    def mysql_database(self):
        return backend_config.MYSQL_DATABASE

    # Redis
    @property
    def redis_host(self):
        return backend_config.REDIS_HOST

    @property
    def redis_port(self):
        return backend_config.REDIS_PORT

    @property
    def redis_db(self):
        return backend_config.REDIS_DB

    # RabbitMQ
    @property
    def rabbitmq_host(self):
        return backend_config.RABBITMQ_HOST

    @property
    def rabbitmq_port(self):
        return backend_config.RABBITMQ_PORT

    @property
    def rabbitmq_user(self):
        return backend_config.RABBITMQ_USER

    @property
    def rabbitmq_password(self):
        return backend_config.RABBITMQ_PASSWORD

    # JWT
    @property
    def secret_key(self):
        return backend_config.SECRET_KEY

    @property
    def algorithm(self):
        return backend_config.ALGORITHM

    @property
    def access_token_expire_minutes(self):
        return backend_config.ACCESS_TOKEN_EXPIRE_MINUTES

    @property
    def refresh_token_expire_days(self):
        return backend_config.REFRESH_TOKEN_EXPIRE_DAYS

    # Cloudflare Stream
    @property
    def cloudflare_account_id(self):
        return backend_config.CLOUDFLARE_ACCOUNT_ID

    @property
    def cloudflare_stream_api_token(self):
        return backend_config.CLOUDFLARE_STREAM_API_TOKEN

    @property
    def cloudflare_stream_customer_code(self):
        return backend_config.CLOUDFLARE_STREAM_CUSTOMER_CODE

    # Social Authentication - LINE
    @property
    def line_channel_id(self):
        return backend_config.LINE_CHANNEL_ID

    @property
    def line_channel_secret(self):
        return backend_config.LINE_CHANNEL_SECRET

    # Social Authentication - Facebook
    @property
    def facebook_app_id(self):
        return backend_config.FACEBOOK_APP_ID

    @property
    def facebook_app_secret(self):
        return backend_config.FACEBOOK_APP_SECRET

    @property
    def facebook_client_token(self):
        return getattr(backend_config, 'FACEBOOK_CLIENT_TOKEN', None)


# Global settings instance
settings = Settings()
