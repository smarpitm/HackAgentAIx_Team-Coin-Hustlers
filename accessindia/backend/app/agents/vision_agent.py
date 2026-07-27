"""Vision Agent - Image analysis, OCR, object detection"""

import json
import logging
from typing import Dict, Any
from io import BytesIO
from PIL import Image

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from app.config import get_settings
from app.utils.prompts import VISION_PROMPT

logger = logging.getLogger(__name__)


class VisionAgent:
    """Analyzes images using Gemini Vision"""
    
    def __init__(self):
        self.settings = get_settings()
        self.model = None
        
        if GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.settings.gemini_api_key.get_secret_value())
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                logger.info("Vision Agent initialized with Gemini Vision")
            except Exception as e:
                logger.warning(f"Gemini Vision initialization failed: {e}")
                self.model = None
        else:
            logger.warning("google-generativeai not installed. Using fallback.")
    
    async def analyze_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Analyze image for OCR, scene description, and object detection.
        
        Args:
            image_bytes: Image data as bytes
            
        Returns:
            Dict with ocr_text, description, detected_items, confidence
        """
        if self.model:
            try:
                # Open image
                image = Image.open(BytesIO(image_bytes))
                
                # Generate analysis
                response = self.model.generate_content([VISION_PROMPT, image])
                
                # Parse JSON response
                result = json.loads(response.text.strip())
                
                return {
                    "ocr_text": result.get("ocr_text", ""),
                    "description": result.get("description", ""),
                    "detected_items": result.get("detected_items", []),
                    "confidence": result.get("confidence", 0.85)
                }
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                return self._fallback_analysis(image_bytes)
            except Exception as e:
                logger.error(f"Vision Agent error: {e}")
                return self._fallback_analysis(image_bytes)
        else:
            return self._fallback_analysis(image_bytes)
    
    def _fallback_analysis(self, image_bytes: bytes) -> Dict[str, Any]:
        """Fallback analysis when Gemini is unavailable"""
        try:
            image = Image.open(BytesIO(image_bytes))
            width, height = image.size
            mode = image.mode
            
            return {
                "ocr_text": "[OCR not available - Gemini API required]",
                "description": f"Image detected: {width}x{height} pixels, {mode} mode. Gemini Vision API required for detailed analysis.",
                "detected_items": ["image_file"],
                "confidence": 0.5
            }
        except Exception as e:
            logger.error(f"Fallback analysis error: {e}")
            return {
                "ocr_text": "",
                "description": "Unable to process image. Please ensure it's a valid image file.",
                "detected_items": [],
                "confidence": 0.0
            }


# Singleton instance
_vision_agent = None

def get_vision_agent() -> VisionAgent:
    """Get singleton vision agent instance"""
    global _vision_agent
    if _vision_agent is None:
        _vision_agent = VisionAgent()
    return _vision_agent
