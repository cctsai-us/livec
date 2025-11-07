"""
Payment processing endpoints
"""
from fastapi import APIRouter

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/")
async def create_payment():
    """Create payment for order"""
    pass

@router.get("/{payment_id}")
async def get_payment(payment_id: int):
    """Get payment details"""
    pass

@router.get("/{payment_id}/status")
async def check_payment_status(payment_id: int):
    """Check payment status"""
    pass
