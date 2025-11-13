"""
Login history/audit model
"""
from sqlalchemy import Column, BigInteger, String, DateTime, Text
from sqlalchemy.sql import func
from ..db.session import Base


class LoginHistory(Base):
    """Login audit trail"""

    __tablename__ = "login_history"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=True, index=True)  # No FK constraint - independent audit log

    # Login method
    login_method = Column(String(50), nullable=False)  # line, facebook, google, email, etc.
    provider_user_id = Column(String(255), nullable=True)  # Social provider user ID

    # Request info
    ip_address = Column(String(45), nullable=True)  # IPv6 max length
    user_agent = Column(Text, nullable=True)
    device_type = Column(String(50), nullable=True)  # mobile, desktop, tablet

    # Status
    success = Column(String(20), nullable=False)  # success, failed, blocked
    failure_reason = Column(Text, nullable=True)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __repr__(self):
        return f"<LoginHistory(id={self.id}, user_id={self.user_id}, method={self.login_method})>"
