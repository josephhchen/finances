"""API routes for AI service"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from .services.llm_service import LLMService
from .services.embedding_service import EmbeddingService
from .services.financial_analyzer import FinancialAnalyzer

# Routers
health_router = APIRouter()
ai_router = APIRouter()

# Pydantic models
class TransactionData(BaseModel):
    description: str
    amount: float
    date: str
    account_id: Optional[str] = None

class CategorizationRequest(BaseModel):
    transactions: List[TransactionData]

class CategorizationResponse(BaseModel):
    transaction_id: str
    suggested_category: str
    confidence: float
    reasoning: str

class AnalysisRequest(BaseModel):
    user_id: str
    transactions: List[TransactionData]
    time_period: str = "last_30_days"

class AnalysisResponse(BaseModel):
    insights: List[Dict[str, Any]]
    recommendations: List[str]
    financial_health_score: float

class ChatRequest(BaseModel):
    user_id: str
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str]

# Health check routes
@health_router.get("/")
async def health_check():
    return {"status": "healthy", "service": "ai"}

@health_router.get("/ready")
async def readiness_check():
    # Add checks for external dependencies
    return {"status": "ready", "dependencies": {"llm": "connected", "vector_db": "connected"}}

# AI routes
@ai_router.post("/categorize", response_model=List[CategorizationResponse])
async def categorize_transactions(request: CategorizationRequest):
    """
    Automatically categorize transactions using LLM
    """
    try:
        llm_service = LLMService()
        results = await llm_service.categorize_transactions(request.transactions)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Categorization failed: {str(e)}")

@ai_router.post("/analyze", response_model=AnalysisResponse)
async def analyze_spending(request: AnalysisRequest):
    """
    Generate financial insights and analysis
    """
    try:
        analyzer = FinancialAnalyzer()
        analysis = await analyzer.analyze_spending_patterns(
            request.user_id,
            request.transactions,
            request.time_period
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@ai_router.post("/recommendations")
async def get_recommendations(request: AnalysisRequest):
    """
    Get personalized financial recommendations
    """
    try:
        analyzer = FinancialAnalyzer()
        recommendations = await analyzer.generate_recommendations(
            request.user_id,
            request.transactions
        )
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")

@ai_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Chat interface for financial queries
    """
    try:
        llm_service = LLMService()
        response = await llm_service.process_chat_message(
            request.user_id,
            request.message,
            request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@ai_router.post("/embed")
async def create_embeddings(text: str):
    """
    Create embeddings for text data
    """
    try:
        embedding_service = EmbeddingService()
        embeddings = await embedding_service.create_embedding(text)
        return {"embeddings": embeddings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding creation failed: {str(e)}")

@ai_router.get("/insights/{user_id}")
async def get_user_insights(user_id: str):
    """
    Get cached insights for a specific user
    """
    try:
        analyzer = FinancialAnalyzer()
        insights = await analyzer.get_cached_insights(user_id)
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insights retrieval failed: {str(e)}")