"""
Social authentication endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import httpx
import json
import re

from ...db.session import get_db
from ...db.redis_client import redis_client
from ...models.user import User
from ...models.social_account import SocialAccount
from ...models.login_history import LoginHistory
from ...models.session import Session
from ...schemas.auth import LINELoginRequest, TokenResponse
from ...core.social.line import LINEAuthProvider
from ...core.security import create_access_token, create_refresh_token, decode_token
from ...core.config import settings

router = APIRouter(prefix="/auth/social", tags=["Social Authentication"])

@router.post("/line", response_model=TokenResponse)
async def line_login(
    login_request: LINELoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """LINE login - Create or retrieve user account"""

    # Initialize LINE provider
    line_provider = LINEAuthProvider()

    # Log the token for debugging
    print(f"[LINE LOGIN] Received access token: {login_request.access_token}")
    print(f"[LINE LOGIN] Token length: {len(login_request.access_token)}")
    print(f"[LINE LOGIN] Token first 20 chars: {login_request.access_token[:20]}...")

    # Get user info from LINE (this implicitly verifies the token)
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
        # Existing user - update last used
        social_account.last_used_at = datetime.utcnow()
        social_account.access_token = login_request.access_token
        user = await db.get(User, social_account.user_id)
        user.last_login_at = datetime.utcnow()
    else:
        # New user - create account
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
        await db.flush()  # Get user ID

        # Create social account link
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

    # Extract request metadata
    client_host = request.client.host if request.client else None

    # Use device info from client if provided, otherwise fall back to user-agent parsing
    device_type = None
    os_version = None
    user_agent = None
    device_model = None

    if login_request.device_info:
        # Use client-provided device info
        device_info = login_request.device_info
        device_type = device_info.device_os or "unknown"
        os_version = device_info.device_os_version
        device_model = device_info.device_model
        # Build user agent from device info
        user_agent = f"{device_model or 'Unknown'} {device_type}/{os_version or 'Unknown'}"
        if device_info.app_version:
            user_agent += f" App/{device_info.app_version}"
    else:
        # Fallback: parse user agent from request headers
        user_agent = request.headers.get("user-agent", None)

        if user_agent:
            user_agent_lower = user_agent.lower()

            # Parse iOS version (e.g., "iPhone OS 15_5" or "CPU iPhone OS 17_0_1")
            ios_match = re.search(r'iphone os (\d+)[_.](\d+)(?:[_.](\d+))?', user_agent_lower)
            if ios_match:
                device_type = "ios"
                major = ios_match.group(1)
                minor = ios_match.group(2)
                patch = ios_match.group(3) if ios_match.group(3) else "0"
                os_version = f"iOS {major}.{minor}.{patch}"

            # Parse iPad version
            elif "ipad" in user_agent_lower:
                device_type = "ios"
                ipad_match = re.search(r'cpu os (\d+)[_.](\d+)(?:[_.](\d+))?', user_agent_lower)
                if ipad_match:
                    major = ipad_match.group(1)
                    minor = ipad_match.group(2)
                    patch = ipad_match.group(3) if ipad_match.group(3) else "0"
                    os_version = f"iPadOS {major}.{minor}.{patch}"

            # Parse Android version (e.g., "Android 13" or "Android 11; SDK 30")
            elif "android" in user_agent_lower:
                device_type = "android"
                android_match = re.search(r'android (\d+(?:\.\d+)?)', user_agent_lower)
                if android_match:
                    os_version = f"Android {android_match.group(1)}"

            elif "mobile" in user_agent_lower:
                device_type = "mobile"
            else:
                device_type = "desktop"

    # Log login attempt with device info
    login_log = LoginHistory(
        user_id=user.id,
        login_method="line",
        provider_user_id=line_user_id,
        ip_address=client_host,
        user_agent=user_agent,
        device_type=f"{device_type} ({os_version})" if os_version else device_type,
        success="success"
    )
    db.add(login_log)
    await db.commit()

    # Create JWT tokens
    token_data = {"sub": str(user.id), "username": user.username}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Decode tokens to get JTI values
    access_payload = decode_token(access_token)
    refresh_payload = decode_token(refresh_token)

    # Create session record
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

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user_id=user.id,
        username=user.username,
        display_name=user.display_name
    )

@router.get("/line/callback")
async def line_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """LINE OAuth callback - exchanges code for access token and stores in session"""
    code = request.query_params.get("code")
    state = request.query_params.get("state")  # This is the sessionId from frontend

    print(f"[LINE CALLBACK] Received code, state={state}")

    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    try:
        # Exchange the code for tokens
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

            # Store error in session if state provided
            if state:
                session_data = {"status": "failed", "error": error_msg}
                await redis_client.set(
                    f"line_session:{state}",
                    json.dumps(session_data),
                    expire=300  # 5 minutes TTL
                )

            return HTMLResponse(f"""
                <html><body>
                    <h2>Login Failed</h2>
                    <p>{error_msg}</p>
                    <p>You can close this window and return to the app.</p>
                </body></html>
            """)

        token_data = token_res.json()
        print("[LINE CALLBACK] Token exchange successful")
        access_token = token_data.get("access_token")

        # Store LINE access token in session for polling
        if state:
            session_data = {"status": "completed", "access_token": access_token}
            await redis_client.set(
                f"line_session:{state}",
                json.dumps(session_data),
                expire=300  # 5 minutes TTL
            )
            print(f"[LINE CALLBACK] Stored token in session: {state}")

        # Show success page to user
        return HTMLResponse("""
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .container {
                        background: white;
                        padding: 2rem;
                        border-radius: 1rem;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                        text-align: center;
                        max-width: 400px;
                    }
                    .success-icon {
                        font-size: 4rem;
                        color: #00B900;
                        margin-bottom: 1rem;
                    }
                    h2 { color: #333; margin: 0 0 0.5rem 0; }
                    p { color: #666; margin: 0.5rem 0; }
                    .note {
                        background: #f0f0f0;
                        padding: 1rem;
                        border-radius: 0.5rem;
                        margin-top: 1.5rem;
                        font-size: 0.9rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon">✓</div>
                    <h2>Login Successful!</h2>
                    <p>You have successfully logged in with LINE.</p>
                    <div class="note">
                        You can close this window and return to the app.
                        <br><br>
                        The app will automatically detect your login.
                    </div>
                </div>
            </body>
            </html>
        """)

    except Exception as e:
        print(f"[LINE CALLBACK ERROR] {str(e)}")

        # Store error in session if state provided
        if state:
            session_data = {"status": "failed", "error": str(e)}
            await redis_client.set(
                f"line_session:{state}",
                json.dumps(session_data),
                expire=300
            )

        return HTMLResponse(f"""
            <html><body>
                <h2>Login Error</h2>
                <p>{str(e)}</p>
                <p>You can close this window and return to the app.</p>
            </body></html>
        """)

@router.get("/session/{session_id}/status")
async def check_session_status(session_id: str):
    """
    Polling endpoint for frontend to check if login completed.
    Returns session status and access token if available.
    """
    try:
        print(f"[SESSION STATUS] Checking session: {session_id}")

        # Get session data from Redis
        session_key = f"line_session:{session_id}"
        session_data_str = await redis_client.get(session_key)

        if not session_data_str:
            # Session not found - still pending or expired
            print(f"[SESSION STATUS] Session not found: {session_id}")
            return {"status": "pending"}

        session_data = json.loads(session_data_str)
        print(f"[SESSION STATUS] Session found with status: {session_data.get('status')}")

        # Delete session after retrieval if completed/failed
        if session_data.get("status") in ["completed", "failed"]:
            await redis_client.delete(session_key)
            print(f"[SESSION STATUS] Session deleted: {session_id}")

        return session_data

    except Exception as e:
        print(f"[SESSION STATUS ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/facebook")
async def facebook_login():
    """Facebook login"""
    pass

@router.post("/google")
async def google_login():
    """Google login"""
    pass

@router.post("/apple")
async def apple_login():
    """Apple login"""
    pass

@router.post("/instagram")
async def instagram_login():
    """Instagram login"""
    pass

@router.post("/kapook")
async def kapook_login():
    """Kapook login (Thailand)"""
    pass
