from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import VisionResponse
from app.agents.vision_agent import process_image

router = APIRouter(prefix="/api/vision", tags=["Vision Agent"])


@router.post("/analyze", response_model=VisionResponse)
async def analyze_image_file(file: UploadFile = File(...)):
    """Upload an image to get OCR text, scene description, and detected items."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    try:
        contents = await file.read()
        res = process_image(contents, mime_type=file.content_type)
        return VisionResponse(
            ocr_text=res["ocr_text"],
            description=res["description"],
            detected_items=res["detected_items"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision analysis failed: {str(e)}")
