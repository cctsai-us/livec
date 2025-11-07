"""
Live stream model
"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text, Integer, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.session import Base


class Stream(Base):
    """Live stream session model"""

    __tablename__ = "streams"

    # Primary key
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    # Foreign keys
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Cloudflare Stream integration
    cloudflare_stream_uid = Column(String(255), unique=True, nullable=False, index=True)
    cloudflare_rtmps_url = Column(String(500), nullable=True)
    cloudflare_stream_key = Column(String(255), nullable=True)  # Should be encrypted

    # Stream info
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String(500), nullable=True)

    # Status - scheduled, live, ended, cancelled (stored as VARCHAR)
    status = Column(String(20), nullable=False, default="scheduled", index=True)

    # Timing
    scheduled_start_at = Column(DateTime(timezone=True), nullable=True, index=True)
    actual_start_at = Column(DateTime(timezone=True), nullable=True, index=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    # Analytics
    viewer_count_current = Column(Integer, default=0, nullable=False)
    viewer_count_peak = Column(Integer, default=0, nullable=False)
    viewer_count_total = Column(Integer, default=0, nullable=False)  # Total unique viewers

    # Engagement
    like_count = Column(Integer, default=0, nullable=False)
    share_count = Column(Integer, default=0, nullable=False)

    # Recording
    is_recording_enabled = Column(Boolean, default=True, nullable=False)
    recording_url = Column(String(500), nullable=True)  # Cloudflare R2 URL

    # Localization
    language = Column(String(10), default="en", nullable=False)
    country_target = Column(String(5), nullable=True)  # TW, TH

    # Visibility
    is_featured = Column(Boolean, default=False, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)

    # Additional data
    extra_data = Column(Text, nullable=True)  # JSON string for Cloudflare metadata

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="streams")
    viewers = relationship("StreamViewer", back_populates="stream", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="stream", cascade="all, delete-orphan")
    likes = relationship("StreamLike", back_populates="stream", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_featured_public_status", "is_featured", "is_public", "status"),
    )

    def __repr__(self):
        return f"<Stream(id={self.id}, title={self.title}, status={self.status})>"
