"""
Product Pydantic schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    stock: int

class ProductCreate(ProductBase):
    category_id: Optional[int] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    seller_id: int
    images: List[str] = []

    class Config:
        from_attributes = True
