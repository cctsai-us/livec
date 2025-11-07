# Cloudflare Setup Guide

This guide covers setting up Cloudflare Stream, R2, and CDN for the Live Commerce platform.

## Why Cloudflare?

### Key Benefits
- **No Egress Fees**: R2 storage has zero egress fees (save 90% vs AWS S3)
- **Global CDN**: 270+ cities worldwide with automatic edge caching
- **Managed Streaming**: No need to maintain RTMP/HLS infrastructure
- **Low Latency**: 5-10 second latency for live streams
- **Automatic Scaling**: Handles traffic spikes automatically
- **Built-in Security**: DDoS protection and WAF included
- **Simple Pricing**: $1 per 1000 minutes delivered

## Prerequisites

- Cloudflare account (free tier available)
- Credit card for paid services
- Domain name (optional but recommended)

## 1. Cloudflare Stream Setup

### Create Stream Account

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Stream** in the left sidebar
3. Click **Enable Stream**
4. Note your **Account ID**

### Get API Credentials

1. Go to **My Profile** → **API Tokens**
2. Create a new token with **Stream Edit** permissions
3. Save the **API Token** securely

### Backend Configuration

Add to `backend/.env`:
```bash
# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_STREAM_API_TOKEN=your_api_token
CLOUDFLARE_STREAM_CUSTOMER_CODE=your_customer_code
```

### Install Python SDK

Add to `backend/requirements/base.txt`:
```
cloudflare==2.11.1
httpx==0.26.0
```

### Backend Implementation

Create `backend/app/core/cloudflare_stream.py`:

```python
"""Cloudflare Stream integration"""
import httpx
from typing import Optional, Dict
from app.config import settings

class CloudflareStreamManager:
    BASE_URL = "https://api.cloudflare.com/client/v4"

    def __init__(self):
        self.account_id = settings.CLOUDFLARE_ACCOUNT_ID
        self.api_token = settings.CLOUDFLARE_STREAM_API_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

    async def create_live_input(self, stream_name: str) -> Dict:
        """Create a new live stream input"""
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs"

        data = {
            "meta": {"name": stream_name},
            "recording": {
                "mode": "automatic",  # Auto-record streams
                "timeoutSeconds": 10
            }
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=self.headers)
            response.raise_for_status()
            result = response.json()

            return {
                "uid": result["result"]["uid"],
                "rtmps_url": result["result"]["rtmps"]["url"],
                "rtmps_key": result["result"]["rtmps"]["streamKey"],
                "srt_url": result["result"]["srt"]["url"],
                "srt_passphrase": result["result"]["srt"]["passphrase"],
                "webrtc_url": result["result"]["webRTC"]["url"],
            }

    async def get_stream_playback_url(self, stream_uid: str) -> str:
        """Get HLS playback URL for a stream"""
        # For live streams
        return f"https://customer-{settings.CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/{stream_uid}/manifest/video.m3u8"

    async def get_stream_status(self, stream_uid: str) -> Dict:
        """Get stream status"""
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs/{stream_uid}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            result = response.json()

            return {
                "status": result["result"]["status"],  # connected, live, idle
                "is_live": result["result"]["status"] == "live",
                "recording_available": result["result"]["recording"]["mode"] == "automatic"
            }

    async def delete_live_input(self, stream_uid: str):
        """Delete a live stream input"""
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs/{stream_uid}"

        async with httpx.AsyncClient() as client:
            response = await client.delete(url, headers=self.headers)
            response.raise_for_status()

    async def list_recordings(self, stream_uid: str) -> list:
        """List recordings for a stream"""
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/live_inputs/{stream_uid}/videos"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            result = response.json()

            return result["result"]

    async def get_webhook_url(self) -> str:
        """Get configured webhook URL"""
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/webhook"

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            result = response.json()

            return result["result"]["notificationUrl"]

    async def set_webhook_url(self, webhook_url: str):
        """Set webhook URL for stream events"""
        url = f"{self.BASE_URL}/accounts/{self.account_id}/stream/webhook"

        data = {"notificationUrl": webhook_url}

        async with httpx.AsyncClient() as client:
            response = await client.put(url, json=data, headers=self.headers)
            response.raise_for_status()

cloudflare_stream = CloudflareStreamManager()
```

### API Integration

Update `backend/app/api/v1/streams.py`:

```python
from app.core.cloudflare_stream import cloudflare_stream

@router.post("/")
async def create_stream(stream_data: StreamCreate, current_user=Depends(get_current_user)):
    """Create new stream with Cloudflare"""

    # Create live input in Cloudflare
    cf_stream = await cloudflare_stream.create_live_input(
        stream_name=f"{current_user.username}_{stream_data.title}"
    )

    # Save to database
    stream = await stream_service.create_stream(
        broadcaster_id=current_user.id,
        title=stream_data.title,
        description=stream_data.description,
        cloudflare_uid=cf_stream["uid"],
        rtmps_url=cf_stream["rtmps_url"],
        rtmps_key=cf_stream["rtmps_key"]
    )

    return {
        "id": stream.id,
        "title": stream.title,
        "rtmps_url": cf_stream["rtmps_url"],
        "rtmps_key": cf_stream["rtmps_key"],  # Only show to broadcaster
        "srt_url": cf_stream["srt_url"],
        "playback_url": await cloudflare_stream.get_stream_playback_url(cf_stream["uid"])
    }

@router.get("/{stream_id}")
async def get_stream(stream_id: int):
    """Get stream details"""
    stream = await stream_service.get_stream(stream_id)

    # Get live status from Cloudflare
    status = await cloudflare_stream.get_stream_status(stream.cloudflare_uid)

    return {
        "id": stream.id,
        "title": stream.title,
        "is_live": status["is_live"],
        "playback_url": await cloudflare_stream.get_stream_playback_url(stream.cloudflare_uid),
        "viewer_count": await get_viewer_count(stream_id)  # From Redis
    }
```

### Webhook Handler

Add webhook endpoint to receive stream events:

```python
@router.post("/webhooks/cloudflare/stream")
async def cloudflare_stream_webhook(request: Request):
    """Handle Cloudflare Stream webhooks"""
    data = await request.json()

    event_type = data.get("eventType")
    stream_uid = data.get("uid")

    if event_type == "video.live_input.connected":
        # Broadcaster connected
        await stream_service.update_status(stream_uid, "connected")

    elif event_type == "video.live_input.disconnected":
        # Broadcaster disconnected
        await stream_service.update_status(stream_uid, "ended")

        # Trigger recording processing
        process_stream_recording.delay(stream_uid)

    return {"status": "ok"}
```

## 2. Cloudflare R2 Setup

### Create R2 Bucket

1. In Cloudflare Dashboard, go to **R2**
2. Click **Create bucket**
3. Name: `live-commerce-storage`
4. Region: Auto (global)

### Get R2 Credentials

1. Click **Manage R2 API Tokens**
2. Create new token with **Object Read & Write** permissions
3. Save:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

### Backend Configuration

Add to `backend/.env`:
```bash
# Cloudflare R2
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ENDPOINT_URL=https://your_account_id.r2.cloudflarestorage.com
R2_BUCKET_NAME=live-commerce-storage
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev  # Public bucket URL
```

### Install S3-Compatible Library

R2 is S3-compatible, so use boto3:

```bash
pip install boto3
```

### Backend Implementation

Create `backend/app/core/r2_storage.py`:

```python
"""Cloudflare R2 storage integration"""
import boto3
from botocore.config import Config
from app.config import settings

class R2Storage:
    def __init__(self):
        self.client = boto3.client(
            's3',
            endpoint_url=settings.R2_ENDPOINT_URL,
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            config=Config(signature_version='s3v4'),
            region_name='auto'
        )
        self.bucket = settings.R2_BUCKET_NAME

    async def upload_file(self, file_path: str, object_key: str) -> str:
        """Upload file to R2"""
        self.client.upload_file(file_path, self.bucket, object_key)
        return f"{settings.R2_PUBLIC_URL}/{object_key}"

    async def upload_fileobj(self, file_obj, object_key: str) -> str:
        """Upload file object to R2"""
        self.client.upload_fileobj(file_obj, self.bucket, object_key)
        return f"{settings.R2_PUBLIC_URL}/{object_key}"

    async def download_file(self, object_key: str, file_path: str):
        """Download file from R2"""
        self.client.download_file(self.bucket, object_key, file_path)

    async def delete_file(self, object_key: str):
        """Delete file from R2"""
        self.client.delete_object(Bucket=self.bucket, Key=object_key)

    async def get_presigned_url(self, object_key: str, expiration: int = 3600) -> str:
        """Generate presigned URL for temporary access"""
        url = self.client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket, 'Key': object_key},
            ExpiresIn=expiration
        )
        return url

r2_storage = R2Storage()
```

## 3. Frontend Integration

### Flutter Video Player

Update `frontend/pubspec.yaml`:
```yaml
dependencies:
  video_player: ^2.8.2
  chewie: ^1.7.5
  camera: ^0.10.5
```

### Stream Viewer Widget

```dart
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';

class CloudflareStreamPlayer extends StatefulWidget {
  final String playbackUrl;

  const CloudflareStreamPlayer({required this.playbackUrl});

  @override
  _CloudflareStreamPlayerState createState() => _CloudflareStreamPlayerState();
}

class _CloudflareStreamPlayerState extends State<CloudflareStreamPlayer> {
  late VideoPlayerController _videoController;
  ChewieController? _chewieController;

  @override
  void initState() {
    super.initState();
    _initializePlayer();
  }

  Future<void> _initializePlayer() async {
    _videoController = VideoPlayerController.network(widget.playbackUrl);
    await _videoController.initialize();

    _chewieController = ChewieController(
      videoPlayerController: _videoController,
      autoPlay: true,
      looping: false,
      allowFullScreen: true,
      allowMuting: true,
      showControls: true,
      aspectRatio: 16 / 9,
    );

    setState(() {});
  }

  @override
  void dispose() {
    _videoController.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _chewieController != null
        ? Chewie(controller: _chewieController!)
        : Center(child: CircularProgressIndicator());
  }
}
```

### Broadcasting (RTMPS)

For mobile broadcasting, you'll need a native RTMP library:

**iOS**: Use `HaishinKit` (via platform channel)
**Android**: Use `rtmp-rtsp-stream-client-java` (via platform channel)

Or use a third-party service like **Larix Broadcaster** SDK.

## 4. Webhooks Configuration

### Set Webhook URL

```bash
# In production, set your webhook URL
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/stream/webhook" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"notificationUrl": "https://yourdomain.com/api/v1/webhooks/cloudflare/stream"}'
```

### Webhook Events

Cloudflare Stream sends these events:
- `video.live_input.connected` - Broadcaster connected
- `video.live_input.disconnected` - Broadcaster disconnected
- `video.live_input.recording_available` - Recording ready

## 5. CDN Configuration

### Domain Setup

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable **Proxy** (orange cloud) for API subdomain
4. Configure SSL (Full or Full Strict)

### Cache Rules

Set up caching for static assets:

1. Go to **Rules** → **Page Rules**
2. Add rule: `yourdomain.com/static/*`
3. Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 day

## 6. Testing

### Test Stream Creation

```bash
# Create stream
curl -X POST "http://localhost:8000/api/v1/streams" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Stream", "description": "Testing Cloudflare Stream"}'

# Response includes RTMPS URL and key
```

### Test Broadcasting

Use OBS or similar:
1. Settings → Stream
2. Service: Custom
3. Server: `rtmps://live.cloudflare.com:443/live/`
4. Stream Key: (from API response)
5. Start Streaming

### Test Playback

Open the playback URL in:
- VLC Media Player
- Web browser (HLS.js)
- Flutter app

## 7. Monitoring

### Stream Analytics

Access via API:
```python
async def get_stream_analytics(stream_uid: str):
    url = f"{BASE_URL}/accounts/{account_id}/stream/analytics/views"
    params = {"uid": stream_uid}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)
        return response.json()
```

### Cloudflare Dashboard

Monitor in real-time:
- Stream → Analytics
- View concurrent viewers
- Bandwidth usage
- Geographic distribution

## 8. Cost Optimization

### Tips to Reduce Costs

1. **Enable Recording Selectively**: Only record important streams
2. **Delete Old Recordings**: Set retention policy (30/60/90 days)
3. **Use R2 Lifecycle Policies**: Archive old videos
4. **Optimize Video Quality**: Lower bitrate for less bandwidth
5. **Cache API Responses**: Use Redis to reduce Stream API calls

### Monitoring Costs

Check usage:
1. Cloudflare Dashboard → Billing
2. Stream minutes delivered
3. R2 storage usage
4. Set up billing alerts

## 9. Production Checklist

- [ ] Cloudflare Stream account created
- [ ] API tokens secured in environment variables
- [ ] Webhook URL configured
- [ ] R2 bucket created
- [ ] Domain added to Cloudflare
- [ ] SSL certificates configured
- [ ] CDN cache rules set
- [ ] Monitoring configured
- [ ] Billing alerts set
- [ ] Test stream successful
- [ ] Test playback on all platforms
- [ ] Recording working
- [ ] Webhook events received

## 10. Troubleshooting

### Stream Won't Connect

- Check RTMPS URL and stream key
- Verify firewall allows port 443
- Try SRT instead of RTMPS
- Check Cloudflare Stream status page

### Playback Not Working

- Verify HLS URL is accessible
- Check CORS settings
- Try different player (VLC, web, mobile)
- Check if stream is actually live

### Webhook Not Received

- Verify webhook URL is publicly accessible
- Check HTTPS is configured
- Verify webhook signature (if implemented)
- Check server logs

## Further Reading

- [Cloudflare Stream Documentation](https://developers.cloudflare.com/stream/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Stream API Reference](https://developers.cloudflare.com/api/operations/stream-live-inputs-create-a-live-input)
- [R2 S3 Compatibility](https://developers.cloudflare.com/r2/api/s3/api/)
