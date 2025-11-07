"""
Stream viewer tracking model
"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text, Integer, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.session import Base


class StreamViewer(Base):
    """Stream viewer tracking model"""

    __tablename__ = "stream_viewers"

    # Primary key
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    # Foreign keys
    stream_id = Column(BigInteger, ForeignKey("streams.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)  # NULL for anonymous

    # Timing
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    left_at = Column(DateTime(timezone=True), nullable=True)

    # Engagement
    watch_duration_seconds = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Device info - ios, android, web, desktop (stored as VARCHAR)
    device_type = Column(String(20), nullable=False)
    ip_address = Column(String(45), nullable=True)  # IPv6 support
    user_agent = Column(Text, nullable=True)

    # Relationships
    stream = relationship("Stream", back_populates="viewers")
    user = relationship("User", back_populates="stream_viewers")

    def __repr__(self):
        return f"<StreamViewer(id={self.id}, stream_id={self.stream_id}, user_id={self.user_id})>"
