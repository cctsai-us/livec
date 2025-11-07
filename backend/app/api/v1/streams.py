"""
Live streaming endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional

from ...db.session import get_db
from ...models.stream import Stream
from ...models.user import User
from ...schemas.stream import (
    StreamCreate,
    StreamUpdate,
    StreamResponse,
    StreamListResponse,
    StreamCredentials,
    StreamPlayback,
)
from ...core.streaming import streaming_manager
from ...core.cloudflare_stream import CloudflareStreamError

router = APIRouter(prefix="/streams", tags=["Live Streams"])


# TODO: Replace with actual authentication dependency
async def get_current_user() -> User:
    """Placeholder for authentication - replace with actual JWT auth"""
    # This should be replaced with actual JWT authentication
    raise HTTPException(status_code=401, detail="Authentication not implemented yet")


@router.post("/", response_model=StreamResponse, status_code=status.HTTP_201_CREATED)
async def create_stream(
    stream_data: StreamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new live stream session

    - **title**: Stream title (required)
    - **description**: Stream description
    - **scheduled_start_at**: Scheduled start time
    - **language**: Stream language (en, zh_TW, zh_CN, th, ja)
    - **country_target**: Target country (TW, TH)
    - **is_public**: Public or private stream
    - **enable_recording**: Enable recording

    Returns stream with Cloudflare live input created
    """
    try:
        stream = await streaming_manager.create_stream(
            db=db,
            user_id=current_user.id,
            title=stream_data.title,
            description=stream_data.description,
            scheduled_start_at=stream_data.scheduled_start_at,
            language=stream_data.language,
            country_target=stream_data.country_target,
            is_public=stream_data.is_public,
            enable_recording=stream_data.enable_recording,
        )
        return stream
    except CloudflareStreamError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=StreamListResponse)
async def list_streams(
    status: Optional[str] = Query(None, description="Filter by status (live, scheduled, ended)"),
    language: Optional[str] = Query(None, description="Filter by language"),
    country: Optional[str] = Query(None, description="Filter by country"),
    featured: Optional[bool] = Query(None, description="Filter featured streams"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    """
    List live streams with filtering and pagination

    - **status**: Filter by status (live, scheduled, ended)
    - **language**: Filter by language code
    - **country**: Filter by country code
    - **featured**: Show only featured streams
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    """
    # Build query
    query = select(Stream).where(Stream.is_public == True)

    if status:
        query = query.where(Stream.status == status)

    if language:
        query = query.where(Stream.language == language)

    if country:
        query = query.where(Stream.country_target == country)

    if featured is not None:
        query = query.where(Stream.is_featured == featured)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    result = await db.execute(count_query)
    total = result.scalar() or 0

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.order_by(Stream.created_at.desc()).offset(offset).limit(page_size)

    result = await db.execute(query)
    streams = result.scalars().all()

    return StreamListResponse(
        streams=streams,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{stream_id}", response_model=StreamResponse)
async def get_stream(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Get stream details by ID

    Returns full stream information including viewer counts and status
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    if not stream.is_public:
        raise HTTPException(status_code=403, detail="This stream is private")

    return stream


@router.get("/{stream_id}/credentials", response_model=StreamCredentials)
async def get_stream_credentials(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get streaming credentials for broadcaster

    **Broadcaster only** - Returns RTMPS/SRT/WebRTC credentials for streaming software
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    # Check if user owns this stream
    if stream.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access stream credentials")

    try:
        credentials = await streaming_manager.get_stream_credentials(stream)
        return StreamCredentials(**credentials)
    except CloudflareStreamError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{stream_id}/playback", response_model=StreamPlayback)
async def get_stream_playback(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Get playback URLs for viewers

    Returns HLS/DASH URLs for live stream or recording
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    if not stream.is_public:
        raise HTTPException(status_code=403, detail="This stream is private")

    hls_url = await streaming_manager.get_playback_url(stream, format="hls")
    dash_url = await streaming_manager.get_playback_url(stream, format="dash")
    thumbnail_url = await streaming_manager.get_thumbnail_url(stream)

    return StreamPlayback(
        hls_url=hls_url,
        dash_url=dash_url,
        thumbnail_url=thumbnail_url,
    )


@router.post("/{stream_id}/start", response_model=StreamResponse)
async def start_stream(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Start a live stream

    **Broadcaster only** - Mark stream as live when broadcasting begins
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    if stream.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to start this stream")

    if stream.status != "scheduled":
        raise HTTPException(status_code=400, detail=f"Cannot start stream with status: {stream.status}")

    stream = await streaming_manager.start_stream(db, stream)
    return stream


@router.post("/{stream_id}/end", response_model=StreamResponse)
async def end_stream(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    End a live stream

    **Broadcaster only** - Mark stream as ended and save recording URL
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    if stream.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to end this stream")

    if stream.status != "live":
        raise HTTPException(status_code=400, detail=f"Cannot end stream with status: {stream.status}")

    stream = await streaming_manager.end_stream(db, stream)
    return stream


@router.put("/{stream_id}", response_model=StreamResponse)
async def update_stream(
    stream_id: int,
    stream_data: StreamUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update stream details

    **Broadcaster only** - Update stream metadata
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    if stream.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this stream")

    # Update fields
    update_data = stream_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(stream, field, value)

    await db.commit()
    await db.refresh(stream)

    return stream


@router.delete("/{stream_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stream(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a stream

    **Broadcaster only** - Delete stream and Cloudflare live input
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    if stream.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this stream")

    try:
        await streaming_manager.delete_stream(db, stream)
    except CloudflareStreamError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{stream_id}/like", status_code=status.HTTP_201_CREATED)
async def like_stream(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Like a stream

    Increment like count for the stream
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    # TODO: Implement like tracking with stream_likes table
    stream.like_count += 1
    await db.commit()

    return {"message": "Stream liked successfully"}


# TEMPORARY TEST ENDPOINT - REMOVE AFTER IMPLEMENTING JWT AUTH
@router.post("/test/create", response_model=StreamResponse, status_code=status.HTTP_201_CREATED)
async def test_create_stream(
    stream_data: StreamCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    TEMPORARY TEST ENDPOINT - Bypasses authentication for testing

    Uses hardcoded user_id=1 (streamer_test) to create streams
    Remove this endpoint after implementing proper JWT authentication
    """
    try:
        stream = await streaming_manager.create_stream(
            db=db,
            user_id=1,  # Hardcoded test user
            title=stream_data.title,
            description=stream_data.description,
            scheduled_start_at=stream_data.scheduled_start_at,
            language=stream_data.language,
            country_target=stream_data.country_target,
            is_public=stream_data.is_public,
            enable_recording=stream_data.enable_recording,
        )
        return stream
    except CloudflareStreamError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/{stream_id}/credentials", response_model=StreamCredentials)
async def test_get_stream_credentials(
    stream_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    TEMPORARY TEST ENDPOINT - Get streaming credentials without auth

    Remove this endpoint after implementing proper JWT authentication
    """
    result = await db.execute(select(Stream).where(Stream.id == stream_id))
    stream = result.scalar_one_or_none()

    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")

    try:
        credentials = await streaming_manager.get_stream_credentials(stream)
        return StreamCredentials(**credentials)
    except CloudflareStreamError as e:
        raise HTTPException(status_code=500, detail=str(e))
