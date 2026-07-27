"""Accessibility Audit Agent - Evaluates wheelchair accessibility compliance"""

import json
import logging
import re

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from app.config import get_settings
from app.utils.prompts import AUDIT_PROMPT

logger = logging.getLogger(__name__)


class AuditAgent:
    """Audits building/facility accessibility using Gemini Vision."""

    def __init__(self):
        self.settings = get_settings()
        self.model = None

        if GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.settings.gemini_api_key.get_secret_value())
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("Audit Agent initialized with Gemini Vision")
            except Exception as e:
                logger.warning(f"Gemini Vision initialization failed: {e}")
                self.model = None
        else:
            logger.warning("google-generativeai not installed. Using fallback.")

    async def analyze_accessibility(self, image_bytes: bytes) -> dict:
        """Analyze building/facility image for accessibility compliance.

        Evaluates against RPwD Act 2016 and CPWD guidelines.

        Args:
            image_bytes: Raw image bytes (JPEG/PNG)

        Returns:
            dict with score, issues, fixes
        """
        if self.model:
            try:
                image_part = {
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                }

                response = self.model.generate_content([AUDIT_PROMPT, image_part])
                clean_text = response.text.strip()
                clean_text = re.sub(r"^```json\s*", "", clean_text)
                clean_text = re.sub(r"\s*```$\s*", "", clean_text)

                result = json.loads(clean_text)
                return {
                    "score": int(result.get("score", 50)),
                    "issues": result.get("issues", []),
                    "fixes": result.get("fixes", [])
                }
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error in Audit Agent: {e}")
                return self._fallback_audit()
            except Exception as e:
                logger.error(f"Audit Agent error: {e}")
                return self._fallback_audit()
        else:
            return self._fallback_audit()

    def _fallback_audit(self) -> dict:
        """Fallback when Gemini is unavailable."""
        return {
            "score": 0,
            "issues": ["Unable to analyze accessibility. Gemini Vision API key required."],
            "fixes": ["Configure GEMINI_API_KEY environment variable."]
        }


# Singleton instance
audit_agent = AuditAgent()
