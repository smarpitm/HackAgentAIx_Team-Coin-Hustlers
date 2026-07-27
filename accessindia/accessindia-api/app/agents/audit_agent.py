import json
import logging
import re
from app.config import settings
from app.utils.prompts import AUDIT_PROMPT

logger = logging.getLogger(__name__)


class AuditAgent:
    """Audit Agent for AccessIndia AI — evaluates building/facility images for accessibility compliance."""

    def analyze_accessibility(self, image_bytes: bytes) -> dict:
        """Analyze building/facility image for accessibility compliance using Gemini Vision.

        Evaluates against RPwD Act 2016 and CPWD guidelines.

        Args:
            image_bytes: Raw image bytes (JPEG/PNG)

        Returns:
            dict with score, issues, fixes
        """
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")

                image_part = {
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                }

                response = model.generate_content([AUDIT_PROMPT, image_part])
                clean_text = response.text.strip()
                clean_text = re.sub(r"^```json\s*", "", clean_text)
                clean_text = re.sub(r"\s*```$", "", clean_text)

                parsed = json.loads(clean_text)
                return {
                    "score": int(parsed.get("score", 50)),
                    "issues": parsed.get("issues", []),
                    "fixes": parsed.get("fixes", [])
                }
            except Exception as e:
                logger.warning(f"Gemini audit agent error: {e}")

        # Fallback response
        return {
            "score": 50,
            "issues": ["Unable to analyze accessibility at this time."],
            "fixes": ["Please try uploading a clearer image of the building entrance or ramp."]
        }


# Singleton instance
audit_agent = AuditAgent()
