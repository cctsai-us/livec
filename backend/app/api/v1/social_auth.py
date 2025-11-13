"""
Social authentication endpoints - Router only
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
import json

from ...db.session import get_db
from ...db.redis_client import redis_client
from ...schemas.auth import LINELoginRequest, TokenResponse
from ...controllers.social_auth_line import handle_line_login, handle_line_callback
from ...controllers.social_auth_facebook import handle_facebook_login, handle_facebook_callback
from ...views.social_auth import render_success_page, render_error_page

router = APIRouter(prefix="/auth/social", tags=["Social Authentication"])


@router.post("/line", response_model=TokenResponse)
async def line_login(
    login_request: LINELoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """LINE native login endpoint"""
    return await handle_line_login(login_request, request, db)


@router.get("/line/callback")
async def line_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """LINE OAuth callback endpoint"""
    code = request.query_params.get("code")
    state = request.query_params.get("state")

    try:
        await handle_line_callback(code, state)
        return render_success_page("LINE")
    except Exception as e:
        return render_error_page(str(e))


@router.post("/facebook", response_model=TokenResponse)
async def facebook_login(
    login_request: LINELoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Facebook native login endpoint"""
    return await handle_facebook_login(login_request, request, db)


@router.get("/facebook/callback")
async def facebook_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Facebook OAuth callback endpoint"""
    code = request.query_params.get("code")
    state = request.query_params.get("state")

    try:
        await handle_facebook_callback(code, state)
        return render_success_page("Facebook")
    except Exception as e:
        return render_error_page(str(e))


@router.get("/session/{session_id}/status")
async def check_session_status(session_id: str):
    """
    Polling endpoint for frontend to check if login completed.
    Supports LINE and Facebook sessions.
    """
    try:
        print(f"[SESSION STATUS] Checking session: {session_id}")

        # Try LINE session first
        session_key = f"line_session:{session_id}"
        session_data_str = await redis_client.get(session_key)

        # If not LINE, try Facebook
        if not session_data_str:
            session_key = f"facebook_session:{session_id}"
            session_data_str = await redis_client.get(session_key)

        if not session_data_str:
            print(f"[SESSION STATUS] Session not found: {session_id}")
            return {"status": "pending"}

        session_data = json.loads(session_data_str)
        print(f"[SESSION STATUS] Session found with status: {session_data.get('status')}")

        # Delete after retrieval if completed/failed
        if session_data.get("status") in ["completed", "failed"]:
            await redis_client.delete(session_key)
            print(f"[SESSION STATUS] Session deleted: {session_id}")

        return session_data

    except Exception as e:
        print(f"[SESSION STATUS ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Placeholder endpoints
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
