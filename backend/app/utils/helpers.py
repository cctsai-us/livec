"""
General helper functions
"""
import uuid
from datetime import datetime

def generate_unique_id() -> str:
    """Generate unique ID"""
    return str(uuid.uuid4())

def generate_stream_key(user_id: int) -> str:
    """Generate unique stream key"""
    return f"{user_id}_{generate_unique_id()}"

def format_currency(amount: float, currency: str = "THB") -> str:
    """Format currency amount"""
    if currency == "THB":
        return f"฿{amount:,.2f}"
    elif currency == "TWD":
        return f"NT${amount:,.0f}"
    return f"{amount:,.2f}"
