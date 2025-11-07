"""
Chat WebSocket handler
"""
from fastapi import WebSocket, WebSocketDisconnect
from .connection_manager import manager

async def chat_websocket_endpoint(websocket: WebSocket, stream_id: int):
    """Handle chat WebSocket connections for a stream"""
    room_id = f"stream_{stream_id}"
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_json()
            # TODO: Process and validate chat message
            # TODO: Save to database
            # Broadcast to all viewers
            await manager.broadcast(data, room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
