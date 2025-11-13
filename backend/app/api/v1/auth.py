"""
Authentication endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from datetime import datetime

from ...db.session import get_db
from ...models.session import Session
from ...models.user import User
from ...core.security import create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LogoutRequest(BaseModel):
    refresh_token: str


@router.post("/login")
async def login():
    """User login with email/password"""
    pass


@router.post("/register")
async def register():
    """User registration"""
    pass


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""

    # Decode refresh token
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    refresh_jti = payload.get("jti")
    user_id = int(payload.get("sub"))

    # Find active session with this refresh token JTI
    result = await db.execute(
        select(Session).where(
            Session.refresh_token_jti == refresh_jti,
            Session.user_id == user_id,
            Session.is_active == True
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found or inactive"
        )

    # Check if refresh token expired
    if session.expires_at < datetime.utcnow():
        # Mark session as inactive
        session.is_active = False
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )

    # Get user info
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    # Create new access token
    token_data = {"sub": str(user.id), "username": user.username}
    new_access_token = create_access_token(token_data)
    new_access_payload = decode_token(new_access_token)

    # Update session with new access token JTI
    session.access_token_jti = new_access_payload["jti"]
    session.last_activity_at = datetime.utcnow()
    await db.commit()

    return RefreshTokenResponse(
        access_token=new_access_token,
        token_type="bearer"
    )


@router.post("/logout")
async def logout(
    request: LogoutRequest,
    db: AsyncSession = Depends(get_db)
):
    """User logout - invalidate session"""

    # Decode refresh token to get JTI
    payload = decode_token(request.refresh_token)
    if not payload:
        # Even if token is invalid, return success (already logged out)
        return {"message": "Logged out successfully"}

    refresh_jti = payload.get("jti")

    # Mark session as inactive
    await db.execute(
        update(Session).where(
            Session.refresh_token_jti == refresh_jti
        ).values(is_active=False)
    )
    await db.commit()

    return {"message": "Logged out successfully"}
