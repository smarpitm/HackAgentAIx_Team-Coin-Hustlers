"""Orchestrator Agent - Routes user requests to specialized agents"""

import json
import logging
from typing import Dict, Any

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from app.config import get_settings
from app.utils.prompts import ORCHESTRATOR_PROMPT

logger = logging.getLogger(__name__)


class OrchestratorAgent:
    """Classifies user intent and routes to appropriate agent"""
    
    def __init__(self):
        self.settings = get_settings()
        self.model = None
        
        if GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.settings.gemini_api_key.get_secret_value())
                self.model = genai.GenerativeModel('gemini-2.5-flash')
                logger.info("Orchestrator initialized with Gemini")
            except Exception as e:
                logger.warning(f"Gemini initialization failed: {e}. Using fallback.")
                self.model = None
        else:
            logger.warning("google-generativeai not installed. Using fallback.")
    
    async def classify_intent(self, message: str) -> Dict[str, Any]:
        """
        Classify user intent and route to appropriate agent.
        
        Args:
            message: User message text
            
        Returns:
            Dict with intent, agent, confidence, and message
        """
        if self.model:
            try:
                prompt = ORCHESTRATOR_PROMPT.format(message=message)
                response = self.model.generate_content(prompt)
                
                # Parse JSON response
                result = json.loads(response.text.strip())
                
                # Map intent to agent
                agent_map = {
                    "VISION": "Vision Agent",
                    "COMMUNICATION": "Communication Agent",
                    "NAVIGATION": "Navigation Agent",
                    "AUDIT": "Accessibility Audit Agent",
                    "GENERAL": "General Assistant"
                }
                
                return {
                    "intent": result.get("intent", "GENERAL"),
                    "agent": agent_map.get(result.get("intent", "GENERAL"), "General Assistant"),
                    "confidence": result.get("confidence", 0.8),
                    "message": f"I've routed your request to the {agent_map.get(result.get('intent', 'GENERAL'), 'General Assistant')}.",
                    "reasoning": result.get("reasoning", "")
                }
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                return self._fallback_classify(message)
            except Exception as e:
                logger.error(f"Orchestrator error: {e}")
                return self._fallback_classify(message)
        else:
            return self._fallback_classify(message)
    
    def _fallback_classify(self, message: str) -> Dict[str, Any]:
        """Fallback intent classification using keyword matching"""
        message_lower = message.lower()
        
        # Simple keyword-based classification
        if any(word in message_lower for word in ['image', 'picture', 'photo', 'see', 'look', 'read', 'text', 'ocr']):
            return {
                "intent": "VISION",
                "agent": "Vision Agent",
                "confidence": 0.7,
                "message": "I'll help you analyze images and extract text.",
                "reasoning": "Keyword-based fallback classification"
            }
        elif any(word in message_lower for word in ['speak', 'voice', 'listen', 'sign', 'gesture', 'communicate']):
            return {
                "intent": "COMMUNICATION",
                "agent": "Communication Agent",
                "confidence": 0.7,
                "message": "I'll assist with speech and sign language communication.",
                "reasoning": "Keyword-based fallback classification"
            }
        elif any(word in message_lower for word in ['navigate', 'route', 'direction', 'map', 'location', 'nearby', 'wheelchair']):
            return {
                "intent": "NAVIGATION",
                "agent": "Navigation Agent",
                "confidence": 0.7,
                "message": "I'll help you find wheelchair-accessible routes.",
                "reasoning": "Keyword-based fallback classification"
            }
        elif any(word in message_lower for word in ['audit', 'accessibility', 'assess', 'evaluate', 'building', 'facility']):
            return {
                "intent": "AUDIT",
                "agent": "Accessibility Audit Agent",
                "confidence": 0.7,
                "message": "I'll evaluate accessibility of buildings and facilities.",
                "reasoning": "Keyword-based fallback classification"
            }
        else:
            return {
                "intent": "GENERAL",
                "agent": "General Assistant",
                "confidence": 0.6,
                "message": "Hello! I'm AccessIndia AI. I can help with vision assistance, communication, navigation, and accessibility audits. How can I assist you?",
                "reasoning": "Keyword-based fallback classification"
            }


# Singleton instance
_orchestrator = None

def get_orchestrator() -> OrchestratorAgent:
    """Get singleton orchestrator instance"""
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = OrchestratorAgent()
    return _orchestrator
