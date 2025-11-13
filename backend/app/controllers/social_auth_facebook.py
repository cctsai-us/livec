"""Facebook authentication controller"""
from datetime import datetime
from fastapi import HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import httpx
import json

from ..models.user import User
from ..models.social_account import SocialAccount
from ..schemas.auth import LINELoginRequest, TokenResponse
from ..core.config import settings
from ..db.redis_client import redis_client
from .social_auth import parse_device_info, create_login_history, create_user_session


async def handle_facebook_login(
    login_request: LINELoginRequest,
    request: Request,
    db: AsyncSession
) -> TokenResponse:
    """Handle Facebook native login"""
    print(f"[FACEBOOK LOGIN] Received access token: {login_request.access_token[:20]}...")

    # Get user info from Facebook Graph API
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://graph.facebook.com/v18.0/me",
                params={
                    "fields": "id,name,picture",
                    "access_token": login_request.access_token,
                }
            )
            if response.status_code != 200:
                raise Exception(f"Facebook API error: {response.text}")
            fb_user_info = response.json()
        print(f"[FACEBOOK LOGIN] Successfully got user info: {fb_user_info}")
    except Exception as e:
        print(f"[FACEBOOK LOGIN ERROR] Failed to get user info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Facebook access token: {str(e)}"
        )

    fb_user_id = fb_user_info.get("id")
    display_name = fb_user_info.get("name")
    picture_url = fb_user_info.get("picture", {}).get("data", {}).get("url")

    # Check if social account exists
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.provider == "facebook",
            SocialAccount.provider_user_id == fb_user_id
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
            username=f"facebook_{fb_user_id}",
            display_name=display_name or f"Facebook User {fb_user_id[:8]}",
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
            provider="facebook",
            provider_user_id=fb_user_id,
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
    await create_login_history(db, user.id, "facebook", fb_user_id, request, device_type, os_version, user_agent)

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


async def handle_facebook_callback(code: str, state: str):
    """Handle Facebook OAuth callback"""
    print(f"[FACEBOOK CALLBACK] Received code, state={state}")

    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_res = await client.get(
                "https://graph.facebook.com/v18.0/oauth/access_token",
                params={
                    "client_id": settings.facebook_app_id,
                    "client_secret": settings.facebook_app_secret,
                    "redirect_uri": f"{settings.api_base_url}/auth/social/facebook/callback",
                    "code": code,
                },
            )

        if token_res.status_code != 200:
            error_msg = f"Facebook token exchange failed: {token_res.text}"
            print(f"[FACEBOOK CALLBACK ERROR] {error_msg}")

            if state:
                session_data = {"status": "failed", "error": error_msg}
                await redis_client.set(f"facebook_session:{state}", json.dumps(session_data), expire=300)

            raise Exception(error_msg)

        token_data = token_res.json()
        print("[FACEBOOK CALLBACK] Token exchange successful")
        access_token = token_data.get("access_token")

        # Store Facebook access token in session for polling
        if state:
            session_data = {"status": "completed", "access_token": access_token}
            await redis_client.set(f"facebook_session:{state}", json.dumps(session_data), expire=300)
            print(f"[FACEBOOK CALLBACK] Stored token in session: {state}")

        return True

    except Exception as e:
        print(f"[FACEBOOK CALLBACK ERROR] {str(e)}")

        if state:
            session_data = {"status": "failed", "error": str(e)}
            await redis_client.set(f"facebook_session:{state}", json.dumps(session_data), expire=300)

        raise
