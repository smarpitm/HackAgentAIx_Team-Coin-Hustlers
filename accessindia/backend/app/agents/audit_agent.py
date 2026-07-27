"""Accessibility Audit Agent - Evaluates wheelchair accessibility"""

import json
import logging
from typing import Dict, Any, List
from io import BytesIO
from PIL import Image

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from app.config import get_settings
from app.utils.prompts import AUDIT_PROMPT

logger = logging.getLogger(__name__)


class AuditAgent:
    """Audits building accessibility using Gemini Vision"""
    
    def __init__(self):
        self.settings = get_settings()
        self.model = None
        
        if GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.settings.gemini_api_key.get_secret_value())
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                logger.info("Audit Agent initialized with Gemini Vision")
            except Exception as e:
                logger.warning(f"Gemini Vision initialization failed: {e}")
                self.model = None
        else:
            logger.warning("google-generativeai not installed. Using fallback.")
    
    async def audit_accessibility(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Audit building/facility accessibility from image.
        
        Args:
            image_bytes: Image data as bytes
            
        Returns:
            Dict with score, issues, fixes, summary
        """
        if self.model:
            try:
                # Open image
                image = Image.open(BytesIO(image_bytes))
                
                # Generate audit
                response = self.model.generate_content([AUDIT_PROMPT, image])
                
                # Parse JSON response
                result = json.loads(response.text.strip())
                
                return {
                    "score": result.get("score", 50),
                    "summary": result.get("summary", ""),
                    "issues": result.get("issues", []),
                    "fixes": result.get("fixes", [])
                }
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                return self._fallback_audit()
            except Exception as e:
                logger.error(f"Audit Agent error: {e}")
                return self._fallback_audit()
        else:
            return self._fallback_audit()
    
    def _fallback_audit(self) -> Dict[str, Any]:
        """Fallback audit when Gemini is unavailable"""
        return {
            "score": 0,
            "summary": "Accessibility audit requires Gemini Vision API. Please configure GEMINI_API_KEY to enable detailed analysis.",
            "issues": [
                {
                    "category": "api_unavailable",
                    "description": "Gemini Vision API not configured",
                    "severity": "critical"
                }
            ],
            "fixes": [
                {
                    "issue_category": "api_unavailable",
                    "fix_description": "Add GEMINI_API_KEY to environment variables",
                    "estimated_cost": "Free tier available"
                }
            ]
        }


# Singleton instance
_audit_agent = None

def get_audit_agent() -> AuditAgent:
    """Get singleton audit agent instance"""
    global _audit_agent
    if _audit_agent is None:
        _audit_agent = AuditAgent()
    return _audit_agent
