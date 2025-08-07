"""Configuration settings for AI service"""

import os
from typing import Optional
from pydantic import BaseSettings


class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    PORT: int = 8001
    
    # API Keys
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    PINECONE_API_KEY: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "postgresql://localhost:5432/budget_tracker"
    REDIS_URL: str = "redis://localhost:6379"
    
    # Vector Database
    PINECONE_ENVIRONMENT: str = "us-west1-gcp"
    PINECONE_INDEX_NAME: str = "budget-insights"
    
    # LLM Settings
    DEFAULT_MODEL: str = "gpt-4"
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7
    
    # Embedding Settings
    EMBEDDING_MODEL: str = "text-embedding-ada-002"
    EMBEDDING_DIMENSION: int = 1536
    
    class Config:
        env_file = ".env"


settings = Settings()