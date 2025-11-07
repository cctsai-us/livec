"""
Stream status WebSocket handler
"""
from fastapi import WebSocket, WebSocketDisconnect
from .connection_manager import manager

async def stream_websocket_endpoint(websocket: WebSocket, stream_id: int):
    """Handle stream status WebSocket connections"""
    room_id = f"stream_status_{stream_id}"
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_json()
            # Handle stream status updates (viewer count, product alerts, etc.)
            await manager.broadcast(data, room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
