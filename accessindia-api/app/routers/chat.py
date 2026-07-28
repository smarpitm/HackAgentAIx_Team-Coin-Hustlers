from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.agents.orchestrator import classify_and_route
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    """Classify user intent and route to the appropriate specialized agent."""
    try:
        result = classify_and_route(request.message)
        return ChatResponse(
            intent=result.get("intent", "general_query"),
            agent=result.get("agent", "general"),
            confidence=float(result.get("confidence", 0.85)),
            message=result.get("message", "Processing your request through AccessIndia Orchestrator."),
            data={"reasoning": result.get("reasoning", "")} if result.get("reasoning") else None
        )
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Orchestrator processing failed: {str(e)}")
