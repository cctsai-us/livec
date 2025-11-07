"""
User model
"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.session import Base


class User(Base):
    """User account model"""

    __tablename__ = "users"

    # Primary key
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    # Authentication
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    phone_number = Column(String(20), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for social-only users

    # Profile
    display_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)

    # User type - viewer, streamer, admin (stored as VARCHAR)
    user_type = Column(String(20), nullable=False, default="viewer", index=True)

    # Status flags
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Localization
    preferred_language = Column(String(10), default="en", nullable=False)  # en, zh_TW, zh_CN, th, ja
    country_code = Column(String(5), nullable=True)  # TW, TH
    timezone = Column(String(50), default="UTC", nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    streams = relationship("Stream", back_populates="user", cascade="all, delete-orphan")
    stream_viewers = relationship("StreamViewer", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    stream_likes = relationship("StreamLike", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, user_type={self.user_type})>"
