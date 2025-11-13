"""LINE authentication controller"""
from datetime import datetime
from fastapi import HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
import json

from ..models.user import User
from ..models.social_account import SocialAccount
from ..schemas.auth import LINELoginRequest, TokenResponse
from ..core.social.line import LINEAuthProvider
from ..core.config import settings
from ..db.redis_client import redis_client
from .social_auth import parse_device_info, create_login_history, create_user_session


async def handle_line_login(
    login_request: LINELoginRequest,
    request: Request,
    db: AsyncSession
) -> TokenResponse:
    """Handle LINE native login"""
    line_provider = LINEAuthProvider()

    print(f"[LINE LOGIN] Received access token: {login_request.access_token[:20]}...")

    # Get user info from LINE
    try:
        line_user_info = await line_provider.get_user_info(login_request.access_token)
        print(f"[LINE LOGIN] Successfully got user info: {line_user_info}")
    except Exception as e:
        print(f"[LINE LOGIN ERROR] Failed to get user info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid LINE access token: {str(e)}"
        )

    line_user_id = line_user_info.get("userId")
    display_name = line_user_info.get("displayName")
    picture_url = line_user_info.get("pictureUrl")

    # Check if social account exists
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.provider == "line",
            SocialAccount.provider_user_id == line_user_id
        )
    )
    social_account = result.scalar_one_or_none()

    if social_account:
        # Existing user
        social_account.last_used_at = datetime.utcnow()
        social_account.access_token = login_request.access_token
        user = await db.get(User, social_account.user_id)
        user.last_login_at = datetime.utcnow()
    else:
        # New user
        user = User(
            username=f"line_{line_user_id}",
            display_name=display_name or f"LINE User {line_user_id[:8]}",
            avatar_url=picture_url,
            user_type="viewer",
            is_verified=False,
            is_active=True,
            last_login_at=datetime.utcnow()
        )
        db.add(user)
        await db.flush()

        social_account = SocialAccount(
            user_id=user.id,
            provider="line",
            provider_user_id=line_user_id,
            provider_username=display_name,
            access_token=login_request.access_token,
            is_primary=True,
            linked_at=datetime.utcnow(),
            last_used_at=datetime.utcnow()
        )
        db.add(social_account)

    await db.commit()
    await db.refresh(user)

    # Parse device info
    device_type, os_version, user_agent = parse_device_info(request, login_request.device_info)

    # Log login
    await create_login_history(db, user.id, "line", line_user_id, request, device_type, os_version, user_agent)

    # Create session
    access_token, refresh_token = await create_user_session(db, user, request, device_type, user_agent)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user_id=user.id,
        username=user.username,
        display_name=user.display_name
    )


async def handle_line_callback(code: str, state: str):
    """Handle LINE OAuth callback"""
    print(f"[LINE CALLBACK] Received code, state={state}")

    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_res = await client.post(
                "https://api.line.me/oauth2/v2.1/token",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": f"{settings.api_base_url}/auth/social/line/callback",
                    "client_id": settings.line_channel_id,
                    "client_secret": settings.line_channel_secret,
                },
            )

        if token_res.status_code != 200:
            error_msg = f"LINE token exchange failed: {token_res.text}"
            print(f"[LINE CALLBACK ERROR] {error_msg}")

            if state:
                session_data = {"status": "failed", "error": error_msg}
                await redis_client.set(f"line_session:{state}", json.dumps(session_data), expire=300)

            raise Exception(error_msg)

        token_data = token_res.json()
        print("[LINE CALLBACK] Token exchange successful")
        access_token = token_data.get("access_token")

        # Store LINE access token in session for polling
        if state:
            session_data = {"status": "completed", "access_token": access_token}
            await redis_client.set(f"line_session:{state}", json.dumps(session_data), expire=300)
            print(f"[LINE CALLBACK] Stored token in session: {state}")

        return True

    except Exception as e:
        print(f"[LINE CALLBACK ERROR] {str(e)}")

        if state:
            session_data = {"status": "failed", "error": str(e)}
            await redis_client.set(f"line_session:{state}", json.dumps(session_data), expire=300)

        raise
