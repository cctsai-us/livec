"""
Product catalog endpoints
"""
from fastapi import APIRouter, Query

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
async def list_products(skip: int = 0, limit: int = 20):
    """List products"""
    pass

@router.get("/{product_id}")
async def get_product(product_id: int):
    """Get product details"""
    pass

@router.post("/")
async def create_product():
    """Create new product (seller only)"""
    pass

@router.put("/{product_id}")
async def update_product(product_id: int):
    """Update product (seller only)"""
    pass

@router.delete("/{product_id}")
async def delete_product(product_id: int):
    """Delete product (seller only)"""
    pass
