"""
Stream like model
"""
from sqlalchemy import Column, BigInteger, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.session import Base


class StreamLike(Base):
    """Stream like model for user engagement"""

    __tablename__ = "stream_likes"

    # Primary key
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    # Foreign keys
    stream_id = Column(BigInteger, ForeignKey("streams.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    stream = relationship("Stream", back_populates="likes")
    user = relationship("User", back_populates="stream_likes")

    # Indexes
    __table_args__ = (
        Index("idx_unique_stream_like", "stream_id", "user_id", unique=True),
    )

    def __repr__(self):
        return f"<StreamLike(id={self.id}, stream_id={self.stream_id}, user_id={self.user_id})>"
