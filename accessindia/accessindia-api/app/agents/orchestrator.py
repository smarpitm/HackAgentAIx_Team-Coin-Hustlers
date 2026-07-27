import json
import logging
import re
from typing import Dict, Any, Optional
from app.config import settings
from app.utils.prompts import ORCHESTRATOR_PROMPT

logger = logging.getLogger(__name__)


def classify_and_route(user_message: str, has_image: bool = False) -> Dict[str, Any]:
    """Classifies user intent and routes to appropriate agent using Gemini 1.5 Flash, with offline fallback."""
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"{ORCHESTRATOR_PROMPT}\nUser input: '{user_message}' (Has image uploaded: {has_image})"
            response = model.generate_content(prompt)
            
            clean_text = response.text.strip()
            clean_text = re.sub(r"^```json\s*", "", clean_text)
            clean_text = re.sub(r"\s*```$", "", clean_text)
            
            parsed = json.loads(clean_text)
            return {
                "intent": parsed.get("intent", "general_query"),
                "agent": parsed.get("agent", "general"),
                "confidence": float(parsed.get("confidence", 0.95)),
                "message": parsed.get("message", "Processing your request through AccessIndia Orchestrator.")
            }
        except Exception as e:
            logger.warning(f"Gemini orchestrator error, falling back to rule engine: {e}")

    # Heuristic Fallback Engine
    msg_lower = user_message.lower()
    
    if has_image:
        if any(w in msg_lower for w in ["audit", "building", "ramp", "stairs", "slope", "entrance"]):
            return {
                "intent": "building_audit",
                "agent": "audit",
                "confidence": 0.92,
                "message": "I've routed your image to the Accessibility Audit Agent to evaluate physical accessibility."
            }
        return {
            "intent": "image_analysis",
            "agent": "vision",
            "confidence": 0.90,
            "message": "I've routed your image to the Vision Agent for text extraction and visual scene description."
        }

    if any(w in msg_lower for w in ["read", "ocr", "see", "text", "picture", "photo", "signboard", "board"]):
        return {
            "intent": "read_text",
            "agent": "vision",
            "confidence": 0.88,
            "message": "Routing to Vision Agent to analyze visual elements or extract text."
        }
    elif any(w in msg_lower for w in ["navigate", "route", "map", "direction", "go to", "metro", "bus", "station", "location", "near"]):
        return {
            "intent": "navigation_query",
            "agent": "navigation",
            "confidence": 0.89,
            "message": "Routing to Navigation Agent to find wheelchair-accessible paths and facilities."
        }
    elif any(w in msg_lower for w in ["speech", "sign", "talk", "listen", "deaf", "mute", "translate", "voice", "gesture"]):
        return {
            "intent": "communication_assist",
            "agent": "communication",
            "confidence": 0.87,
            "message": "Routing to Communication Agent for speech synthesis or sign language gesture processing."
        }
    elif any(w in msg_lower for w in ["audit", "compliance", "ramp", "wheelchair", "barrier", "cpwd", "rpwd"]):
        return {
            "intent": "accessibility_audit",
            "agent": "audit",
            "confidence": 0.91,
            "message": "Routing to Accessibility Audit Agent to check barrier-free standards."
        }

    return {
        "intent": "general_greeting",
        "agent": "general",
        "confidence": 0.85,
        "message": f"Hello! I am AccessIndia AI Orchestrator. How can I assist you today? You can ask for visual description, accessible navigation, building audits, or sign language tools."
    }
