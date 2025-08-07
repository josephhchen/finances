"""
AI Service for Budget Tracker
FastAPI-based microservice for LLM integration and financial AI features
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import ai_router, health_router

# Create FastAPI app
app = FastAPI(
    title="Budget Tracker AI Service",
    description="LLM-powered financial insights and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["ai"])

@app.get("/")
async def root():
    return {"message": "Budget Tracker AI Service", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )