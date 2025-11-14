"""
User management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...dependencies import get_current_user, get_db
from ...models.user import User
from ...schemas.user import UserResponse, UpdateUserRequest

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's profile

    Returns complete user profile including:
    - Personal info (name, email, phone, avatar)
    - User type and verification status
    - Localization preferences (language, timezone)
    - Account timestamps
    """
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    update_data: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user's profile

    Allows updating:
    - Display name, first/last name, nickname
    - Bio and avatar URL
    - Gender
    - Preferred language and timezone
    """
    # Update only provided fields
    update_dict = update_data.dict(exclude_unset=True)

    for field, value in update_dict.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    return current_user

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get public user profile by ID"""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
