"""
JWT Session model
"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.session import Base


class Session(Base):
    """JWT session tracking model"""

    __tablename__ = "sessions"

    # Primary key
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    # Foreign keys
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # JWT identifiers
    access_token_jti = Column(String(255), unique=True, nullable=False, index=True)
    refresh_token_jti = Column(String(255), unique=True, nullable=False, index=True)

    # Device info - ios, android, web, desktop (stored as VARCHAR)
    device_type = Column(String(20), nullable=False)
    device_name = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)

    # Status
    is_active = Column(Boolean, default=True, nullable=False)

    # Timestamps
    expires_at = Column(DateTime(timezone=True), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_activity_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="sessions")

    def __repr__(self):
        return f"<Session(id={self.id}, user_id={self.user_id}, is_active={self.is_active})>"
