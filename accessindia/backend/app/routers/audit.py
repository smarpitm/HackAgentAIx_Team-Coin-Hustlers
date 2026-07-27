"""Audit Router - Accessibility audit endpoints"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import AuditResponse
from app.agents.audit_agent import get_audit_agent
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/audit", tags=["audit"])


@router.post("/analyze", response_model=AuditResponse)
async def audit_accessibility(file: UploadFile = File(...)):
    """
    Audit building/facility accessibility from image.
    
    Args:
        file: Uploaded building/facility image
        
    Returns:
        AuditResponse with score, issues, and fixes
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image bytes
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Audit accessibility
        audit_agent = get_audit_agent()
        result = await audit_agent.audit_accessibility(image_bytes)
        
        return AuditResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Audit analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
