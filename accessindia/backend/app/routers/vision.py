"""Vision Router - Image analysis endpoints"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import VisionResponse
from app.agents.vision_agent import vision_agent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/vision", tags=["vision"])

MAX_FILE_SIZE = 4 * 1024 * 1024  # 4MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}


@router.post("/analyze", response_model=VisionResponse)
async def analyze_image(file: UploadFile = File(...)):
    """Analyze uploaded image for OCR, scene description, and object detection.

    Accepts JPEG/PNG images up to 4MB.

    Args:
        file: Uploaded image file

    Returns:
        VisionResponse with analysis results
    """
    # Validate file type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Only JPEG and PNG images are supported."
        )

    # Read and validate file size
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of 4MB ({len(image_bytes)} bytes uploaded)."
        )

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    try:
        result = await vision_agent.analyze_image(image_bytes)
        return VisionResponse(
            ocr_text=result["ocr_text"],
            description=result["description"],
            detected_items=result.get("detected_items", []),
            confidence=result.get("confidence", 0.90)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vision analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Vision analysis failed: {str(e)}")
