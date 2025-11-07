"""
Cloudflare Stream API client for live streaming integration
"""
import httpx
from typing import Optional, Dict, Any
from datetime import datetime
from ..core.config import settings


class CloudflareStreamError(Exception):
    """Cloudflare Stream API error"""
    pass


class CloudflareStreamClient:
    """
    Cloudflare Stream API client

    Documentation: https://developers.cloudflare.com/api/operations/stream-live-inputs-create-a-live-input
    """

    BASE_URL = "https://api.cloudflare.com/client/v4"

    def __init__(self):
        self.account_id = settings.cloudflare_account_id
        self.api_token = settings.cloudflare_stream_api_token

        if not self.account_id or not self.api_token:
            raise CloudflareStreamError(
                "Missing Cloudflare credentials. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_API_TOKEN"
            )

        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        }

    async def create_live_input(
        self,
        recording: bool = True,
        delete_recording_after_days: Optional[int] = None,
        metadata: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Create a new live input for streaming

        Args:
            recording: Enable recording (default: True)
            delete_recording_after_days: Auto-delete recording after N days
            metadata: Custom metadata (max 10 key-value pairs)

        Returns:
            {
                "uid": "abc123...",
                "rtmps": {
                    "url": "rtmps://live.cloudflare.com:443/live/",
                    "streamKey": "MTQ0MTcz..."
                },
                "rtmpsPlayback": {
                    "url": "rtmps://customer-xxx.cloudflarestream.com/live/abc123...",
                    "streamKey": ""
                },
                "srt": {
                    "url": "srt://live.cloudflare.com:778",
                    "streamId": "abc123...",
                    "passphrase": "..."
                },
                "webRTC": {
                    "url": "https://customer-xxx.cloudflarestream.com/abc123.../webRTC/publish"
                },
                "created": "2024-01-01T00:00:00.000000Z",
                "modified": "2024-01-01T00:00:00.000000Z",
                "meta": {...},
                "recording": {
                    "mode": "automatic",
                    "requireSignedURLs": false,
                    "allowedOrigins": null,
                    "timeoutSeconds": 0
                }
            }
        """
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs"

        payload = {
            "recording": {
                "mode": "automatic" if recording else "off",
                "timeoutSeconds": 0,  # No timeout
                "requireSignedURLs": False,
                "allowedOrigins": None,
            }
        }

        if delete_recording_after_days:
            payload["recording"]["deleteRecordingAfterDays"] = delete_recording_after_days

        if metadata:
            # Cloudflare allows max 10 metadata keys
            if len(metadata) > 10:
                raise CloudflareStreamError("Metadata cannot exceed 10 key-value pairs")
            payload["meta"] = metadata

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=self.headers, json=payload, timeout=30.0)

            if response.status_code != 200:
                error_data = response.json() if response.text else {}
                raise CloudflareStreamError(
                    f"Failed to create live input: {response.status_code} - {error_data}"
                )

            data = response.json()

            if not data.get("success"):
                errors = data.get("errors", [])
                raise CloudflareStreamError(f"Cloudflare API error: {errors}")

            return data["result"]

    async def get_live_input(self, live_input_uid: str) -> Dict[str, Any]:
        """
        Get live input details

        Args:
            live_input_uid: The live input UID

        Returns:
            Live input details (same structure as create_live_input)
        """
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs/{live_input_uid}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers, timeout=30.0)

            if response.status_code == 404:
                raise CloudflareStreamError(f"Live input {live_input_uid} not found")

            if response.status_code != 200:
                error_data = response.json() if response.text else {}
                raise CloudflareStreamError(
                    f"Failed to get live input: {response.status_code} - {error_data}"
                )

            data = response.json()

            if not data.get("success"):
                errors = data.get("errors", [])
                raise CloudflareStreamError(f"Cloudflare API error: {errors}")

            return data["result"]

    async def delete_live_input(self, live_input_uid: str) -> bool:
        """
        Delete a live input

        Args:
            live_input_uid: The live input UID

        Returns:
            True if deleted successfully
        """
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs/{live_input_uid}"

        async with httpx.AsyncClient() as client:
            response = await client.delete(url, headers=self.headers, timeout=30.0)

            if response.status_code == 404:
                raise CloudflareStreamError(f"Live input {live_input_uid} not found")

            if response.status_code != 200:
                error_data = response.json() if response.text else {}
                raise CloudflareStreamError(
                    f"Failed to delete live input: {response.status_code} - {error_data}"
                )

            data = response.json()
            return data.get("success", False)

    async def list_recordings(self, live_input_uid: str) -> list:
        """
        List all recordings for a live input

        Args:
            live_input_uid: The live input UID

        Returns:
            List of recording objects
        """
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs/{live_input_uid}/videos"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers, timeout=30.0)

            if response.status_code != 200:
                error_data = response.json() if response.text else {}
                raise CloudflareStreamError(
                    f"Failed to list recordings: {response.status_code} - {error_data}"
                )

            data = response.json()

            if not data.get("success"):
                errors = data.get("errors", [])
                raise CloudflareStreamError(f"Cloudflare API error: {errors}")

            return data.get("result", [])

    async def get_video(self, video_uid: str) -> Dict[str, Any]:
        """
        Get video (recording) details

        Args:
            video_uid: The video UID

        Returns:
            {
                "uid": "video123...",
                "thumbnail": "https://customer-xxx.cloudflarestream.com/.../thumbnails/thumbnail.jpg",
                "thumbnailTimestampPct": 0,
                "readyToStream": true,
                "status": {
                    "state": "ready",
                    "pctComplete": 100,
                    "errorReasonCode": "",
                    "errorReasonText": ""
                },
                "meta": {...},
                "created": "2024-01-01T00:00:00.000000Z",
                "modified": "2024-01-01T00:00:00.000000Z",
                "size": 123456,
                "preview": "https://customer-xxx.cloudflarestream.com/video123.../watch",
                "allowedOrigins": [],
                "requireSignedURLs": false,
                "uploaded": "2024-01-01T00:00:00.000000Z",
                "uploadExpiry": null,
                "maxSizeBytes": null,
                "maxDurationSeconds": null,
                "duration": 123.45,
                "input": {
                    "width": 1920,
                    "height": 1080
                },
                "playback": {
                    "hls": "https://customer-xxx.cloudflarestream.com/video123.../manifest/video.m3u8",
                    "dash": "https://customer-xxx.cloudflarestream.com/video123.../manifest/video.mpd"
                },
                "watermark": null,
                "liveInput": "abc123..."
            }
        """
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/{video_uid}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers, timeout=30.0)

            if response.status_code == 404:
                raise CloudflareStreamError(f"Video {video_uid} not found")

            if response.status_code != 200:
                error_data = response.json() if response.text else {}
                raise CloudflareStreamError(
                    f"Failed to get video: {response.status_code} - {error_data}"
                )

            data = response.json()

            if not data.get("success"):
                errors = data.get("errors", [])
                raise CloudflareStreamError(f"Cloudflare API error: {errors}")

            return data["result"]

    async def update_live_input(
        self,
        live_input_uid: str,
        metadata: Optional[Dict[str, str]] = None,
        recording_mode: Optional[str] = None,
        delete_recording_after_days: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Update live input settings

        Args:
            live_input_uid: The live input UID
            metadata: New metadata (replaces existing)
            recording_mode: "automatic" or "off"
            delete_recording_after_days: Auto-delete after N days

        Returns:
            Updated live input details
        """
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs/{live_input_uid}"

        payload = {}

        if metadata is not None:
            if len(metadata) > 10:
                raise CloudflareStreamError("Metadata cannot exceed 10 key-value pairs")
            payload["meta"] = metadata

        if recording_mode or delete_recording_after_days:
            recording = {}
            if recording_mode:
                recording["mode"] = recording_mode
            if delete_recording_after_days:
                recording["deleteRecordingAfterDays"] = delete_recording_after_days
            payload["recording"] = recording

        async with httpx.AsyncClient() as client:
            response = await client.put(url, headers=self.headers, json=payload, timeout=30.0)

            if response.status_code != 200:
                error_data = response.json() if response.text else {}
                raise CloudflareStreamError(
                    f"Failed to update live input: {response.status_code} - {error_data}"
                )

            data = response.json()

            if not data.get("success"):
                errors = data.get("errors", [])
                raise CloudflareStreamError(f"Cloudflare API error: {errors}")

            return data["result"]

    def get_playback_url(self, video_uid: str, format: str = "hls") -> str:
        """
        Get playback URL for a video (recording)

        Args:
            video_uid: The video UID
            format: "hls" or "dash"

        Returns:
            Playback URL
        """
        customer_code = settings.cloudflare_stream_customer_code or self.account_id

        if format == "hls":
            return f"https://customer-{customer_code}.cloudflarestream.com/{video_uid}/manifest/video.m3u8"
        elif format == "dash":
            return f"https://customer-{customer_code}.cloudflarestream.com/{video_uid}/manifest/video.mpd"
        else:
            raise ValueError(f"Invalid format: {format}. Use 'hls' or 'dash'")

    def get_thumbnail_url(self, video_uid: str, time: Optional[str] = None, width: int = 1920, height: int = 1080) -> str:
        """
        Get thumbnail URL for a video

        Args:
            video_uid: The video UID
            time: Timestamp in format "1m2s" or "1h2m3s" (default: auto)
            width: Thumbnail width
            height: Thumbnail height

        Returns:
            Thumbnail URL
        """
        customer_code = settings.cloudflare_stream_customer_code or self.account_id
        base_url = f"https://customer-{customer_code}.cloudflarestream.com/{video_uid}/thumbnails/thumbnail.jpg"

        params = []
        if time:
            params.append(f"time={time}")
        if width:
            params.append(f"width={width}")
        if height:
            params.append(f"height={height}")

        if params:
            return f"{base_url}?{'&'.join(params)}"
        return base_url


# Global instance
cloudflare_stream = CloudflareStreamClient()
