"""
User management endpoints
"""
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
async def get_current_user():
    """Get current user profile"""
    pass

@router.put("/me")
async def update_profile():
    """Update user profile"""
    pass

@router.get("/{user_id}")
async def get_user(user_id: int):
    """Get user by ID"""
    pass
