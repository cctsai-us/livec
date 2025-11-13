"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import streams, social_auth, phone_auth
from .db.redis_client import redis_client

app = FastAPI(
    title="Live Commerce API",
    description="Live streaming + ecommerce platform API",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Connect to Redis on startup"""
    await redis_client.connect()
    print("✓ Redis connected")

@app.on_event("shutdown")
async def shutdown_event():
    """Disconnect from Redis on shutdown"""
    await redis_client.disconnect()
    print("✓ Redis disconnected")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(streams.router, prefix="/api/v1", tags=["Live Streams"])
app.include_router(social_auth.router, prefix="/api/v1")
app.include_router(phone_auth.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Live Commerce API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
