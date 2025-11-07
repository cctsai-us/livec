"""
Live streaming service layer
"""
from typing import Optional, Dict, Any
from datetime import datetime
import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .cloudflare_stream import cloudflare_stream, CloudflareStreamError
from ..models.stream import Stream
from ..models.user import User


class StreamingManager:
    """Manage live streaming sessions with Cloudflare Stream"""

    async def create_stream(
        self,
        db: AsyncSession,
        user_id: int,
        title: str,
        description: Optional[str] = None,
        scheduled_start_at: Optional[datetime] = None,
        language: str = "en",
        country_target: Optional[str] = None,
        is_public: bool = True,
        enable_recording: bool = True,
    ) -> Stream:
        """
        Create a new live stream session

        Args:
            db: Database session
            user_id: User ID
            title: Stream title
            description: Stream description
            scheduled_start_at: Scheduled start time
            language: Stream language (en, zh_TW, th, ja)
            country_target: Target country (TW, TH)
            is_public: Public or private stream
            enable_recording: Enable recording

        Returns:
            Stream object with Cloudflare live input created

        Raises:
            CloudflareStreamError: If Cloudflare API fails
        """
        # Create Cloudflare live input
        metadata = {
            "user_id": str(user_id),
            "title": title,
            "language": language,
        }

        if country_target:
            metadata["country"] = country_target

        try:
            cf_live_input = await cloudflare_stream.create_live_input(
                recording=enable_recording,
                metadata=metadata,
            )
        except CloudflareStreamError as e:
            raise CloudflareStreamError(f"Failed to create Cloudflare live input: {str(e)}")

        # Create stream record in database
        stream = Stream(
            user_id=user_id,
            cloudflare_stream_uid=cf_live_input["uid"],
            cloudflare_rtmps_url=cf_live_input["rtmps"]["url"],
            cloudflare_stream_key=cf_live_input["rtmps"]["streamKey"],
            title=title,
            description=description,
            status="scheduled",
            scheduled_start_at=scheduled_start_at,
            language=language,
            country_target=country_target,
            is_public=is_public,
            is_recording_enabled=enable_recording,
            extra_data=str(cf_live_input),  # Store full Cloudflare response
        )

        db.add(stream)
        await db.commit()
        await db.refresh(stream)

        return stream

    async def get_stream_credentials(self, stream: Stream) -> Dict[str, Any]:
        """
        Get streaming credentials for broadcaster

        Args:
            stream: Stream object

        Returns:
            {
                "rtmps_url": "rtmps://live.cloudflare.com:443/live/",
                "stream_key": "MTQ0MTcz...",
                "srt_url": "srt://live.cloudflare.com:778",
                "srt_stream_id": "abc123...",
                "webrtc_url": "https://customer-xxx.cloudflarestream.com/abc123.../webRTC/publish"
            }
        """
        # Get latest live input data from Cloudflare
        cf_live_input = await cloudflare_stream.get_live_input(stream.cloudflare_stream_uid)

        return {
            "rtmps_url": cf_live_input["rtmps"]["url"],
            "stream_key": cf_live_input["rtmps"]["streamKey"],
            "srt_url": cf_live_input.get("srt", {}).get("url"),
            "srt_stream_id": cf_live_input.get("srt", {}).get("streamId"),
            "srt_passphrase": cf_live_input.get("srt", {}).get("passphrase"),
            "webrtc_url": cf_live_input.get("webRTC", {}).get("url"),
        }

    async def get_playback_url(self, stream: Stream, format: str = "hls") -> Optional[str]:
        """
        Get playback URL for live stream or recording

        Args:
            stream: Stream object
            format: "hls" or "dash"

        Returns:
            Playback URL or None if not available
        """
        try:
            # Check if stream has recordings
            recordings = await cloudflare_stream.list_recordings(stream.cloudflare_stream_uid)

            if recordings:
                # Get the latest recording
                latest_recording = recordings[0]
                video_uid = latest_recording["uid"]
                return cloudflare_stream.get_playback_url(video_uid, format)

            # For live streams (no recording yet), use live input UID
            # Note: Cloudflare uses the same UID for live playback
            return cloudflare_stream.get_playback_url(stream.cloudflare_stream_uid, format)

        except CloudflareStreamError:
            return None

    async def start_stream(self, db: AsyncSession, stream: Stream) -> Stream:
        """
        Mark stream as live (called when broadcaster starts streaming)

        Args:
            db: Database session
            stream: Stream object

        Returns:
            Updated stream object
        """
        stream.status = "live"
        stream.actual_start_at = datetime.utcnow()

        await db.commit()
        await db.refresh(stream)

        return stream

    async def end_stream(self, db: AsyncSession, stream: Stream) -> Stream:
        """
        End a live stream

        Args:
            db: Database session
            stream: Stream object

        Returns:
            Updated stream object
        """
        stream.status = "ended"
        stream.ended_at = datetime.utcnow()

        # Get recordings from Cloudflare
        try:
            recordings = await cloudflare_stream.list_recordings(stream.cloudflare_stream_uid)

            if recordings and len(recordings) > 0:
                # Store the latest recording URL
                latest_recording = recordings[0]
                video_uid = latest_recording["uid"]
                stream.recording_url = cloudflare_stream.get_playback_url(video_uid, "hls")

        except CloudflareStreamError:
            # Recording might not be ready yet
            pass

        await db.commit()
        await db.refresh(stream)

        return stream

    async def delete_stream(self, db: AsyncSession, stream: Stream) -> bool:
        """
        Delete stream and Cloudflare live input

        Args:
            db: Database session
            stream: Stream object

        Returns:
            True if deleted successfully
        """
        # Delete from Cloudflare
        try:
            await cloudflare_stream.delete_live_input(stream.cloudflare_stream_uid)
        except CloudflareStreamError:
            # Live input might already be deleted
            pass

        # Delete from database
        await db.delete(stream)
        await db.commit()

        return True

    async def update_viewer_count(
        self,
        db: AsyncSession,
        stream: Stream,
        current_count: int
    ) -> Stream:
        """
        Update viewer count for stream

        Args:
            db: Database session
            stream: Stream object
            current_count: Current viewer count

        Returns:
            Updated stream object
        """
        stream.viewer_count_current = current_count

        # Update peak if needed
        if current_count > stream.viewer_count_peak:
            stream.viewer_count_peak = current_count

        await db.commit()
        await db.refresh(stream)

        return stream

    async def get_thumbnail_url(self, stream: Stream, width: int = 1920, height: int = 1080) -> Optional[str]:
        """
        Get thumbnail URL for stream

        Args:
            stream: Stream object
            width: Thumbnail width
            height: Thumbnail height

        Returns:
            Thumbnail URL or None
        """
        try:
            # Check if stream has recordings
            recordings = await cloudflare_stream.list_recordings(stream.cloudflare_stream_uid)

            if recordings:
                # Get thumbnail from latest recording
                latest_recording = recordings[0]
                video_uid = latest_recording["uid"]
                return cloudflare_stream.get_thumbnail_url(video_uid, width=width, height=height)

            # For live streams, use live input UID
            return cloudflare_stream.get_thumbnail_url(stream.cloudflare_stream_uid, width=width, height=height)

        except CloudflareStreamError:
            return None


# Global instance
streaming_manager = StreamingManager()
