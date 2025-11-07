"""
Order Pydantic schemas
"""
from pydantic import BaseModel
from typing import List
from decimal import Decimal
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

class OrderCreate(BaseModel):
    items: List[OrderItemBase]

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
