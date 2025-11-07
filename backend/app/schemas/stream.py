"""
Stream Pydantic schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class StreamCreate(BaseModel):
    """Schema for creating a new stream"""
    title: str = Field(..., min_length=1, max_length=255, description="Stream title")
    description: Optional[str] = Field(None, description="Stream description")
    scheduled_start_at: Optional[datetime] = Field(None, description="Scheduled start time")
    language: str = Field("en", description="Stream language (en, zh_TW, zh_CN, th, ja)")
    country_target: Optional[str] = Field(None, max_length=5, description="Target country (TW, TH)")
    is_public: bool = Field(True, description="Public or private stream")
    enable_recording: bool = Field(True, description="Enable recording")


class StreamUpdate(BaseModel):
    """Schema for updating a stream"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    scheduled_start_at: Optional[datetime] = None
    language: Optional[str] = None
    country_target: Optional[str] = None
    is_public: Optional[bool] = None
    is_featured: Optional[bool] = None


class StreamCredentials(BaseModel):
    """Schema for stream credentials (broadcaster only)"""
    rtmps_url: str
    stream_key: str
    srt_url: Optional[str] = None
    srt_stream_id: Optional[str] = None
    srt_passphrase: Optional[str] = None
    webrtc_url: Optional[str] = None


class StreamPlayback(BaseModel):
    """Schema for stream playback URLs"""
    hls_url: Optional[str] = None
    dash_url: Optional[str] = None
    thumbnail_url: Optional[str] = None


class StreamResponse(BaseModel):
    """Schema for stream response"""
    id: int
    user_id: int
    title: str
    description: Optional[str]
    thumbnail_url: Optional[str]
    status: str  # scheduled, live, ended, cancelled
    scheduled_start_at: Optional[datetime]
    actual_start_at: Optional[datetime]
    ended_at: Optional[datetime]
    viewer_count_current: int
    viewer_count_peak: int
    viewer_count_total: int
    like_count: int
    share_count: int
    language: str
    country_target: Optional[str]
    is_featured: bool
    is_public: bool
    is_recording_enabled: bool
    recording_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StreamListResponse(BaseModel):
    """Schema for stream list response"""
    streams: list[StreamResponse]
    total: int
    page: int
    page_size: int
