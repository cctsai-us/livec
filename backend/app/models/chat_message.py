"""
Chat message model
"""
from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Text, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.session import Base


class ChatMessage(Base):
    """Chat message model for live streams"""

    __tablename__ = "chat_messages"

    # Primary key
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    # Foreign keys
    stream_id = Column(BigInteger, ForeignKey("streams.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    reply_to_message_id = Column(BigInteger, ForeignKey("chat_messages.id", ondelete="SET NULL"), nullable=True)

    # Message content
    message = Column(Text, nullable=False)

    # Message type - text, emoji, sticker, system (stored as VARCHAR)
    message_type = Column(String(20), nullable=False, default="text")

    # Moderation flags
    is_pinned = Column(Boolean, default=False, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    is_flagged = Column(Boolean, default=False, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    stream = relationship("Stream", back_populates="chat_messages")
    user = relationship("User", back_populates="chat_messages")
    replies = relationship("ChatMessage", backref="parent_message", remote_side=[id])

    # Indexes
    __table_args__ = (
        Index("idx_stream_created", "stream_id", "created_at"),
        Index("idx_stream_pinned", "stream_id", "is_pinned"),
    )

    def __repr__(self):
        return f"<ChatMessage(id={self.id}, stream_id={self.stream_id}, user_id={self.user_id})>"
