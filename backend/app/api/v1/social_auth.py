"""
Social authentication endpoints
"""
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/auth/social", tags=["Social Authentication"])

@router.post("/line")
async def line_login():
    """LINE login"""
    pass

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
