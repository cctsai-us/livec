"""
Input validation utilities
"""
import re

def validate_phone_number(phone: str, country: str = "TW") -> bool:
    """Validate phone number for Taiwan or Thailand"""
    if country == "TW":
        # Taiwan mobile: 09XX-XXX-XXX
        pattern = r"^09\d{8}$"
    elif country == "TH":
        # Thailand mobile: 0X-XXXX-XXXX
        pattern = r"^0[689]\d{8}$"
    else:
        return False
    return bool(re.match(pattern, phone.replace("-", "")))

def validate_password_strength(password: str) -> bool:
    """Validate password strength"""
    # At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    return True
