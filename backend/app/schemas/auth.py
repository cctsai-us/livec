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
