"""Chat Router - Orchestrator endpoint"""

from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.agents.orchestrator import get_orchestrator
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint - routes to appropriate agent.
    
    Args:
        request: ChatRequest with message and optional session_id
        
    Returns:
        ChatResponse with intent, agent, confidence, message
    """
    try:
        orchestrator = get_orchestrator()
        result = await orchestrator.classify_intent(request.message)
        
        return ChatResponse(
            intent=result["intent"],
            agent=result["agent"],
            confidence=result["confidence"],
            message=result["message"],
            data={"reasoning": result.get("reasoning", "")}
        )
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
