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
    """Upload an image to extract OCR text, scene description, and detected items.

    Accepts JPEG/PNG images up to 4MB.
    """
    # Validate file type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Only JPEG and PNG images are supported."
        )

    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of 4MB ({len(contents)} bytes uploaded)."
        )

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    try:
        result = vision_agent.analyze_image(contents)
        return VisionResponse(
            ocr_text=result["ocr_text"],
            description=result["description"],
            detected_items=result.get("detected_items", []),
            confidence=result.get("confidence", 0.90)
        )
    except Exception as e:
        logger.error(f"Vision analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Vision analysis failed: {str(e)}")
