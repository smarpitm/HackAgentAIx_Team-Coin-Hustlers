from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import AuditResponse
from app.agents.audit_agent import audit_agent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/audit", tags=["audit"])

MAX_FILE_SIZE = 4 * 1024 * 1024  # 4MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}


@router.post("/analyze", response_model=AuditResponse)
async def analyze_accessibility(file: UploadFile = File(...)):
    """Upload a building or facility image to evaluate accessibility compliance.

    Accepts JPEG/PNG images up to 4MB.
    Returns accessibility score, identified issues, and recommended fixes.
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
        result = audit_agent.analyze_accessibility(contents)
        return AuditResponse(
            score=result["score"],
            issues=result.get("issues", []),
            fixes=result.get("fixes", [])
        )
    except Exception as e:
        logger.error(f"Accessibility audit failed: {e}")
        raise HTTPException(status_code=500, detail=f"Accessibility audit failed: {str(e)}")
