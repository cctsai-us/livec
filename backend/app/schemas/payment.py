"""
Payment Pydantic schemas
"""
from pydantic import BaseModel
from decimal import Decimal

class PaymentCreate(BaseModel):
    order_id: int
    payment_method: str

class PaymentResponse(BaseModel):
    id: int
    order_id: int
    amount: Decimal
    status: str
    payment_url: str

    class Config:
        from_attributes = True
