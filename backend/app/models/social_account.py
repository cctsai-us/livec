"""
Social account linking model
"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.session import Base


class SocialAccount(Base):
    """Social media account linking model"""

    __tablename__ = "social_accounts"

    # Primary key
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    # Foreign keys
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Provider info - line, facebook, instagram, google, apple, kapook (stored as VARCHAR)
    provider = Column(String(50), nullable=False, index=True)
    provider_user_id = Column(String(255), nullable=False)  # ID from social platform
    provider_username = Column(String(255), nullable=True)
    provider_email = Column(String(255), nullable=True)

    # Tokens (should be encrypted in production)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Additional data
    profile_data = Column(Text, nullable=True)  # JSON string for additional profile info

    # Status
    is_primary = Column(Boolean, default=False, nullable=False)

    # Timestamps
    linked_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_used_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="social_accounts")

    # Indexes
    __table_args__ = (
        Index("idx_unique_provider_account", "provider", "provider_user_id", unique=True),
    )

    def __repr__(self):
        return f"<SocialAccount(id={self.id}, user_id={self.user_id}, provider={self.provider})>"
