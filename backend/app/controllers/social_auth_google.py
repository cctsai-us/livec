"""Google authentication controller"""
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


async def handle_google_login(
    login_request: LINELoginRequest,
    request: Request,
    db: AsyncSession
) -> TokenResponse:
    """Handle Google native login"""
    print(f"[GOOGLE LOGIN] Received ID token: {login_request.access_token[:20]}...")

    # Verify ID token with Google
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": login_request.access_token}
            )
            if response.status_code != 200:
                raise Exception(f"Google token verification failed: {response.text}")
            google_user_info = response.json()
        print(f"[GOOGLE LOGIN] Successfully verified token: {google_user_info}")
    except Exception as e:
        print(f"[GOOGLE LOGIN ERROR] Failed to verify token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google ID token: {str(e)}"
        )

    google_user_id = google_user_info.get("sub")
    email = google_user_info.get("email")
    display_name = google_user_info.get("name")
    picture_url = google_user_info.get("picture")

    # Validate required fields
    if not google_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google ID token: missing user ID"
        )

    # Check if social account exists
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.provider == "google",
            SocialAccount.provider_user_id == google_user_id
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
        email_verified = google_user_info.get("email_verified", False)
        # Convert string "true"/"false" to boolean
        if isinstance(email_verified, str):
            email_verified = email_verified.lower() == "true"

        # Determine display name safely
        if display_name:
            user_display_name = display_name
        elif email:
            user_display_name = email.split("@")[0]
        else:
            user_display_name = f"Google User {google_user_id[:8]}"

        user = User(
            username=f"google_{google_user_id[:16]}",
            display_name=user_display_name,
            email=email,
            avatar_url=picture_url,
            user_type="viewer",
            is_verified=email_verified,
            is_active=True,
            last_login_at=datetime.utcnow()
        )
        db.add(user)
        await db.flush()

        social_account = SocialAccount(
            user_id=user.id,
            provider="google",
            provider_user_id=google_user_id,
            provider_username=email,
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
    await create_login_history(db, user.id, "google", google_user_id, request, device_type, os_version, user_agent)

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


async def handle_google_callback(code: str, state: str):
    """Handle Google OAuth callback"""
    print(f"[GOOGLE CALLBACK] Received code, state={state}")

    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_res = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": f"{settings.api_base_url}/auth/social/google/callback",
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                },
            )

        if token_res.status_code != 200:
            error_msg = f"Google token exchange failed: {token_res.text}"
            print(f"[GOOGLE CALLBACK ERROR] {error_msg}")

            if state:
                session_data = {"status": "failed", "error": error_msg}
                await redis_client.set(f"google_session:{state}", json.dumps(session_data), expire=300)

            raise Exception(error_msg)

        token_data = token_res.json()
        print("[GOOGLE CALLBACK] Token exchange successful")
        id_token = token_data.get("id_token")

        # Store Google ID token in session for polling
        if state:
            session_data = {"status": "completed", "access_token": id_token}
            await redis_client.set(f"google_session:{state}", json.dumps(session_data), expire=300)
            print(f"[GOOGLE CALLBACK] Stored token in session: {state}")

        return True

    except Exception as e:
        print(f"[GOOGLE CALLBACK ERROR] {str(e)}")

        if state:
            session_data = {"status": "failed", "error": str(e)}
            await redis_client.set(f"google_session:{state}", json.dumps(session_data), expire=300)

        raise
