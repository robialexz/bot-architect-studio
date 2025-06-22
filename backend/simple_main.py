#!/usr/bin/env python3
"""
Simplified main.py for testing
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create simple FastAPI app
app = FastAPI(
    title="FlowsyAI Backend API - Simple",
    description="Simplified version for testing",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "FlowsyAI Backend API - Simple",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": "development",
        "database": "not_connected"
    }

@app.post("/api/v1/auth/register")
async def simple_register():
    """Simple register endpoint for testing"""
    return {
        "message": "Registration endpoint working",
        "status": "success"
    }

if __name__ == "__main__":
    print("🚀 Starting simplified FlowsyAI Backend...")
    uvicorn.run(
        "simple_main:app",
        host="0.0.0.0",
        port=8001,  # Different port to avoid conflicts
        reload=True,
        log_level="info"
    )
