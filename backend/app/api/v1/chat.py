"""
Chat/comments endpoints
"""
from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.get("/streams/{stream_id}/messages")
async def get_stream_messages(stream_id: int):
    """Get chat messages for stream"""
    pass

@router.post("/streams/{stream_id}/messages")
async def send_message(stream_id: int):
    """Send chat message"""
    pass
