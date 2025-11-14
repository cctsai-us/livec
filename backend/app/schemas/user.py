"""
User Pydantic schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(UserBase):
    id: int
    phone_number: Optional[str] = None

    # Profile
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    nickname: Optional[str] = None
    display_name: str
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

    # User type and status
    user_type: str
    is_verified: bool
    is_active: bool

    # Localization
    preferred_language: str
    country_code: Optional[str] = None
    timezone: str

    # Timestamps
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UpdateUserRequest(BaseModel):
    """Schema for updating user profile"""
    display_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    nickname: Optional[str] = None
    bio: Optional[str] = None
    gender: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_language: Optional[str] = None
    timezone: Optional[str] = None
