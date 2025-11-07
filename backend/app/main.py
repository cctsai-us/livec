"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import streams

app = FastAPI(
    title="Live Commerce API",
    description="Live streaming + ecommerce platform API",
    version="1.0.0"
)

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

@app.get("/")
async def root():
    return {"message": "Live Commerce API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
