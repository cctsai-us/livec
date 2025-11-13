"""
Authentication Pydantic schemas
"""
from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    display_name: str

class SocialAuthRequest(BaseModel):
    access_token: str
    provider: str

class DeviceInfo(BaseModel):
    device_model: Optional[str] = None
    device_os: Optional[str] = None
    device_os_version: Optional[str] = None
    app_version: Optional[str] = None

class LINELoginRequest(BaseModel):
    access_token: str
    device_info: Optional[DeviceInfo] = None

class PhoneSendCodeRequest(BaseModel):
    phone_number: str  # E.164 format (e.g., +886912345678)
    country_code: str  # ISO country code (e.g., "TW", "US")
    language: Optional[str] = "en"  # Language for SMS message

class PhoneVerifyCodeRequest(BaseModel):
    phone_number: str  # E.164 format
    code: str  # 6-digit verification code

class PhoneRegisterRequest(BaseModel):
    phone_number: str  # E.164 format
    verification_code: str  # 6-digit code
    first_name: str
    last_name: str
    nickname: str
    gender: Optional[str] = None  # male, female, other, prefer_not_to_say
    date_of_birth: Optional[str] = None  # YYYYMMDD
    email: Optional[str] = None
    device_info: Optional[DeviceInfo] = None

class CountryResponse(BaseModel):
    country_code: str
    dial_code: str
    name: str
    flag_emoji: Optional[str] = None
