import base64
from fastapi import APIRouter, HTTPException
from app.models import ChatMessageRequest, OrchestratorResponse
from app.agents.orchestrator import classify_and_route
from app.agents.vision_agent import process_image
from app.agents.audit_agent import audit_building_image
from app.agents.navigation_agent import get_accessible_route

router = APIRouter(prefix="/api/chat", tags=["Orchestrator Chat"])


@router.post("", response_model=OrchestratorResponse)
async def handle_chat_message(payload: ChatMessageRequest):
    """Main Orchestrator endpoint: receives user message/file, classifies intent, and executes sub-agent response."""
    try:
        has_image = bool(payload.image_base64)
        routing_info = classify_and_route(payload.message, has_image=has_image)
        
        target_agent = routing_info.get("agent", "general")
        data_payload = None

        if has_image:
            # Decode base64 image data if present
            image_data = payload.image_base64
            if "," in image_data:
                image_data = image_data.split(",")[1]
            raw_bytes = base64.b64decode(image_data)
            
            if target_agent == "audit":
                data_payload = audit_building_image(raw_bytes)
            else:
                data_payload = process_image(raw_bytes)
        elif target_agent == "navigation":
            # Extract destination from text if available
            dest = payload.message.replace("navigate to", "").replace("route to", "").strip() or "Connaught Place"
            data_payload = get_accessible_route("Current Location", dest)

        return OrchestratorResponse(
            intent=routing_info["intent"],
            agent=target_agent,
            confidence=routing_info["confidence"],
            message=routing_info["message"],
            data=data_payload
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Orchestrator processing failed: {str(e)}")
