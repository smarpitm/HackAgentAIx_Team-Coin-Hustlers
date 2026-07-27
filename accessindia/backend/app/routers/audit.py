"""Audit Router - Accessibility audit endpoints"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import AuditResponse
from app.agents.audit_agent import audit_agent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/audit", tags=["audit"])

MAX_FILE_SIZE = 4 * 1024 * 1024  # 4MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}


@router.post("/analyze", response_model=AuditResponse)
async def audit_accessibility(file: UploadFile = File(...)):
    """Audit building/facility accessibility from uploaded image.

    Accepts JPEG/PNG images up to 4MB.
    Returns accessibility score, identified issues, and recommended fixes.

    Args:
        file: Uploaded building/facility image

    Returns:
        AuditResponse with score, issues, and fixes
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
        result = await audit_agent.analyze_accessibility(image_bytes)
        return AuditResponse(
            score=result["score"],
            issues=result.get("issues", []),
            fixes=result.get("fixes", [])
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Audit analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Accessibility audit failed: {str(e)}")
