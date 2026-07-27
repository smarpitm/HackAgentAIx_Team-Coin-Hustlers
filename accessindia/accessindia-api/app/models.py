from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class ChatMessageRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    image_base64: Optional[str] = Field(None, description="Optional base64 encoded image")
    location: Optional[Dict[str, float]] = Field(None, description="Optional lat/lng coordinates")


class OrchestratorResponse(BaseModel):
    intent: str
    agent: str
    confidence: float
    message: str
    data: Optional[Dict[str, Any]] = None


class VisionResponse(BaseModel):
    ocr_text: str
    description: str
    detected_items: List[str]


class AuditIssue(BaseModel):
    title: str
    severity: str  # high, medium, low
    description: str


class AuditFix(BaseModel):
    title: str
    cost_estimate: str
    description: str


class AuditResponse(BaseModel):
    score: int
    issues: List[str]
    fixes: List[str]


class NavRequest(BaseModel):
    origin: str
    destination: str
    mode: Optional[str] = "transit"
    wheelchair_accessible: bool = True


class NearbyRequest(BaseModel):
    latitude: float
    longitude: float
    facility_type: Optional[str] = "accessible_restroom"


class NavStep(BaseModel):
    instruction: str
    distance: str
    duration: str
    accessible: bool = True


class NavResponse(BaseModel):
    origin: str
    destination: str
    distance: str
    duration: str
    steps: List[NavStep]
    nearby_facilities: List[Dict[str, Any]]
    accessibility_summary: str
