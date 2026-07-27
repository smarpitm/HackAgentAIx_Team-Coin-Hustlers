from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import AuditResponse
from app.agents.audit_agent import audit_building_image

router = APIRouter(prefix="/api/audit", tags=["Accessibility Audit Agent"])


@router.post("/analyze", response_model=AuditResponse)
async def analyze_building_accessibility(file: UploadFile = File(...)):
    """Upload a building or facility image to calculate accessibility score, identify barriers, and get CPWD compliant fixes."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    try:
        contents = await file.read()
        res = audit_building_image(contents, mime_type=file.content_type)
        return AuditResponse(
            score=res["score"],
            issues=res["issues"],
            fixes=res["fixes"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Accessibility audit failed: {str(e)}")
