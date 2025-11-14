"""
Phone authentication API endpoints
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import random
import string

from ...db.session import get_db
from ...schemas.auth import (
    PhoneSendCodeRequest,
    PhoneVerifyCodeRequest,
    PhoneRegisterRequest,
    TokenResponse,
    CountryResponse
)
from ...models import User, Country
from ...core.sms import create_sms_router_from_config
from ...core.config import settings
from config.backend_config import config
from ...dependencies import get_redis
from ...controllers.social_auth import parse_device_info, create_login_history, create_user_session

router = APIRouter(prefix="/phone", tags=["phone-auth"])


def generate_verification_code() -> str:
    """Generate a 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))


@router.get("/countries", response_model=List[CountryResponse])
async def get_countries(
    language: str = "en",
    db: AsyncSession = Depends(get_db)
):
    """
    Get list of supported countries for phone registration

    Query parameters:
    - language: Language code (en, zh_TW, zh_CN, th, ja)
    """
    try:
        # Fetch active countries ordered by display_order
        result = await db.execute(
            select(Country)
            .where(Country.is_active == True)
            .order_by(Country.display_order)
        )
        countries = result.scalars().all()

        # Convert to response format with localized names
        return [country.to_dict(language) for country in countries]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch countries: {str(e)}")


@router.post("/send-code")
async def send_verification_code(
    request: PhoneSendCodeRequest,
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis)
):
    """
    Send SMS verification code to phone number

    Rate limiting: 1 code per phone number per minute
    """
    try:
        # Check if phone number already registered
        result = await db.execute(
            select(User).where(User.phone_number == request.phone_number)
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Phone number already registered"
            )

        # Check rate limiting (1 minute cooldown)
        rate_limit_key = f"phone_code_rate:{request.phone_number}"
        if await redis.exists(rate_limit_key):
            raise HTTPException(
                status_code=429,
                detail="Please wait before requesting another code"
            )

        # Generate verification code
        code = generate_verification_code()

        # Store code in Redis with 10-minute expiration
        redis_key = f"phone_verification:{request.phone_number}"
        await redis.setex(redis_key, 600, code)  # 10 minutes TTL

        # Set rate limit (1 minute)
        await redis.setex(rate_limit_key, 60, "1")

        # Send SMS via country-specific SMS router
        sms_router = create_sms_router_from_config(config)

        await sms_router.send_verification_code(
            to_phone=request.phone_number,
            code=code,
            language=request.language
        )

        return {
            "success": True,
            "message": "Verification code sent",
            "expires_in": 600  # seconds
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send code: {str(e)}")


@router.post("/verify-code")
async def verify_code(
    request: PhoneVerifyCodeRequest,
    redis = Depends(get_redis)
):
    """
    Verify SMS code without registration (for testing or pre-validation)
    """
    try:
        redis_key = f"phone_verification:{request.phone_number}"
        stored_code = await redis.get(redis_key)

        if not stored_code:
            raise HTTPException(
                status_code=400,
                detail="Verification code expired or not found"
            )

        if stored_code.decode('utf-8') != request.code:
            raise HTTPException(
                status_code=400,
                detail="Invalid verification code"
            )

        return {
            "success": True,
            "message": "Code verified successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")


@router.post("/register", response_model=TokenResponse)
async def register_with_phone(
    register_data: PhoneRegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis)
):
    """
    Register new user with phone number after SMS verification
    """
    try:
        # Verify the code
        redis_key = f"phone_verification:{register_data.phone_number}"
        stored_code = await redis.get(redis_key)

        if not stored_code:
            raise HTTPException(
                status_code=400,
                detail="Verification code expired or not found"
            )

        if stored_code.decode('utf-8') != register_data.verification_code:
            raise HTTPException(
                status_code=400,
                detail="Invalid verification code"
            )

        # Check if phone number already registered
        result = await db.execute(
            select(User).where(User.phone_number == register_data.phone_number)
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Phone number already registered"
            )

        # Validate gender if provided
        valid_genders = ["male", "female", "other", "prefer_not_to_say"]
        if register_data.gender and register_data.gender not in valid_genders:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid gender. Must be one of: {', '.join(valid_genders)}"
            )

        # Create display name from first + last name
        display_name = f"{register_data.first_name} {register_data.last_name}".strip()

        # Create new user
        new_user = User(
            phone_number=register_data.phone_number,
            email=register_data.email,
            username=register_data.phone_number,  # Use phone as username
            display_name=display_name,
            first_name=register_data.first_name,
            last_name=register_data.last_name,
            nickname=register_data.nickname,
            gender=register_data.gender,
            date_of_birth=register_data.date_of_birth,
            is_active=True,
            last_login_at=datetime.utcnow()
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        # Delete verification code from Redis
        await redis.delete(redis_key)

        # Parse device info
        device_type, os_version, user_agent = parse_device_info(request, register_data.device_info)

        # Log login history
        await create_login_history(
            db, new_user.id, "phone", register_data.phone_number,
            request, device_type, os_version, user_agent
        )

        # Create session and generate tokens
        access_token, refresh_token = await create_user_session(
            db, new_user, request, device_type, user_agent
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user_id=new_user.id,
            username=new_user.username,
            display_name=new_user.display_name
        )

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
