"""Vision Router - Image analysis endpoints"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import VisionResponse
from app.agents.vision_agent import get_vision_agent
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/vision", tags=["vision"])


@router.post("/analyze", response_model=VisionResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze uploaded image for OCR, scene description, and object detection.
    
    Args:
        file: Uploaded image file
        
    Returns:
        VisionResponse with analysis results
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Analyze image
        vision_agent = get_vision_agent()
        result = await vision_agent.analyze_image(image_bytes)
        
        return VisionResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vision analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
