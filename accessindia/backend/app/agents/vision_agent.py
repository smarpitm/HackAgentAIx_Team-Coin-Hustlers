"""Vision Agent - Image analysis, OCR, object detection"""

import json
import logging
import re

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from app.config import get_settings
from app.utils.prompts import VISION_PROMPT

logger = logging.getLogger(__name__)


class VisionAgent:
    """Analyzes images using Gemini Vision for OCR, scene description, and object detection."""

    def __init__(self):
        self.settings = get_settings()
        self.model = None

        if GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.settings.gemini_api_key.get_secret_value())
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("Vision Agent initialized with Gemini Vision")
            except Exception as e:
                logger.warning(f"Gemini Vision initialization failed: {e}")
                self.model = None
        else:
            logger.warning("google-generativeai not installed. Using fallback.")

    async def analyze_image(self, image_bytes: bytes) -> dict:
        """Analyze image for OCR, scene description, and object detection.

        Args:
            image_bytes: Raw image bytes (JPEG/PNG)

        Returns:
            dict with ocr_text, description, detected_items, confidence=0.90
        """
        if self.model:
            try:
                image_part = {
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                }

                response = self.model.generate_content([VISION_PROMPT, image_part])
                clean_text = response.text.strip()
                clean_text = re.sub(r"^```json\s*", "", clean_text)
                clean_text = re.sub(r"\s*```$\s*", "", clean_text)

                result = json.loads(clean_text)
                return {
                    "ocr_text": result.get("ocr_text", ""),
                    "description": result.get("description", ""),
                    "detected_items": result.get("detected_items", []),
                    "confidence": 0.90
                }
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error in Vision Agent: {e}")
                return self._fallback_analysis()
            except Exception as e:
                logger.error(f"Vision Agent error: {e}")
                return self._fallback_analysis()
        else:
            return self._fallback_analysis()

    def _fallback_analysis(self) -> dict:
        """Fallback when Gemini is unavailable."""
        return {
            "ocr_text": "",
            "description": "Unable to analyze image. Gemini Vision API key required.",
            "detected_items": [],
            "confidence": 0.0
        }


# Singleton instance
vision_agent = VisionAgent()
