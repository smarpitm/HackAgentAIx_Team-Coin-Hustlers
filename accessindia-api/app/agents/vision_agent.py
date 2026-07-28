import json
import logging
import re
from app.config import settings
from app.utils.prompts import VISION_PROMPT

logger = logging.getLogger(__name__)


class VisionAgent:
    """Vision Agent for AccessIndia AI — analyzes images for OCR, scene description, and object detection."""

    def analyze_image(self, image_bytes: bytes) -> dict:
        """Analyze image using Gemini 1.5 Flash Vision.

        Args:
            image_bytes: Raw image bytes (JPEG/PNG)

        Returns:
            dict with ocr_text, description, detected_items, confidence
        """
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-2.5-flash")

                image_part = {
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                }

                response = model.generate_content([VISION_PROMPT, image_part])
                clean_text = response.text.strip()
                clean_text = re.sub(r"^```json\s*", "", clean_text)
                clean_text = re.sub(r"\s*```$", "", clean_text)

                parsed = json.loads(clean_text)
                return {
                    "ocr_text": parsed.get("ocr_text", ""),
                    "description": parsed.get("description", ""),
                    "detected_items": parsed.get("detected_items", []),
                    "confidence": 0.90
                }
            except Exception as e:
                logger.warning(f"Gemini vision agent error: {e}")

        # Fallback response
        return {
            "ocr_text": "",
            "description": "Unable to analyze image at this time.",
            "detected_items": [],
            "confidence": 0.0
        }


# Singleton instance
vision_agent = VisionAgent()
