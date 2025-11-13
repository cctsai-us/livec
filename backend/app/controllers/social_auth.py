"""General social authentication utilities"""
from datetime import datetime
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
import re
from typing import Optional, Tuple

from ..models.user import User
from ..models.login_history import LoginHistory
from ..models.session import Session
from ..core.security import create_access_token, create_refresh_token, decode_token


def parse_device_info(request: Request, device_info=None) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """Parse device information from request"""
    device_type = None
    os_version = None
    user_agent = None

    if device_info:
        device_type = device_info.device_os or "unknown"
        os_version = device_info.device_os_version
        device_model = device_info.device_model
        user_agent = f"{device_model or 'Unknown'} {device_type}/{os_version or 'Unknown'}"
        if device_info.app_version:
            user_agent += f" App/{device_info.app_version}"
    else:
        user_agent = request.headers.get("user-agent", None)

        if user_agent:
            user_agent_lower = user_agent.lower()

            # iOS
            ios_match = re.search(r'iphone os (\d+)[_.](\d+)(?:[_.](\d+))?', user_agent_lower)
            if ios_match:
                device_type = "ios"
                major, minor = ios_match.group(1), ios_match.group(2)
                patch = ios_match.group(3) or "0"
                os_version = f"iOS {major}.{minor}.{patch}"

            # iPad
            elif "ipad" in user_agent_lower:
                device_type = "ios"
                ipad_match = re.search(r'cpu os (\d+)[_.](\d+)(?:[_.](\d+))?', user_agent_lower)
                if ipad_match:
                    major, minor = ipad_match.group(1), ipad_match.group(2)
                    patch = ipad_match.group(3) or "0"
                    os_version = f"iPadOS {major}.{minor}.{patch}"

            # Android
            elif "android" in user_agent_lower:
                device_type = "android"
                android_match = re.search(r'android (\d+(?:\.\d+)?)', user_agent_lower)
                if android_match:
                    os_version = f"Android {android_match.group(1)}"

            elif "mobile" in user_agent_lower:
                device_type = "mobile"
            else:
                device_type = "desktop"

    return device_type, os_version, user_agent


async def create_login_history(
    db: AsyncSession,
    user_id: int,
    provider: str,
    provider_user_id: str,
    request: Request,
    device_type: Optional[str],
    os_version: Optional[str],
    user_agent: Optional[str]
):
    """Log login attempt"""
    client_host = request.client.host if request.client else None

    login_log = LoginHistory(
        user_id=user_id,
        login_method=provider,
        provider_user_id=provider_user_id,
        ip_address=client_host,
        user_agent=user_agent,
        device_type=f"{device_type} ({os_version})" if os_version else device_type,
        success="success"
    )
    db.add(login_log)
    await db.commit()


async def create_user_session(
    db: AsyncSession,
    user: User,
    request: Request,
    device_type: Optional[str],
    user_agent: Optional[str]
) -> Tuple[str, str]:
    """Create JWT tokens and session"""
    token_data = {"sub": str(user.id), "username": user.username}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    access_payload = decode_token(access_token)
    refresh_payload = decode_token(refresh_token)

    client_host = request.client.host if request.client else None
    session = Session(
        user_id=user.id,
        access_token_jti=access_payload["jti"],
        refresh_token_jti=refresh_payload["jti"],
        device_type=device_type or "unknown",
        ip_address=client_host,
        user_agent=user_agent,
        expires_at=datetime.utcfromtimestamp(refresh_payload["exp"]),
        is_active=True
    )
    db.add(session)
    await db.commit()

    return access_token, refresh_token
