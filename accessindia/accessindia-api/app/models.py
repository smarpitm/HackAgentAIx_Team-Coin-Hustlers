from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")


class ChatResponse(BaseModel):
    intent: str = Field(..., description="Classified user intent")
    agent: str = Field(..., description="Agent name that handled the request")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Classification confidence")
    message: str = Field(..., description="Agent response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional structured data")


class VisionResponse(BaseModel):
    ocr_text: str = Field(..., description="Extracted text from image")
    description: str = Field(..., description="Scene description")
    detected_items: List[str] = Field(default_factory=list, description="Detected objects")
    confidence: float = Field(default=0.90, ge=0.0, le=1.0, description="Analysis confidence")


class NavRouteRequest(BaseModel):
    origin_lat: float = Field(..., ge=-90, le=90, description="Origin latitude")
    origin_lng: float = Field(..., ge=-180, le=180, description="Origin longitude")
    destination: str = Field(..., description="Destination address or place name")
    mode: str = Field(default="walking", description="Travel mode (walking, driving, transit)")


class NavRouteStep(BaseModel):
    instruction: str = Field(..., description="Step instruction")
    distance: str = Field(..., description="Step distance")
    duration: str = Field(..., description="Step duration")


class NavRouteResponse(BaseModel):
    distance: str = Field(..., description="Total distance")
    duration: str = Field(..., description="Estimated duration")
    steps: List[NavRouteStep] = Field(default_factory=list, description="Step-by-step directions")


class AuditIssue(BaseModel):
    title: str = Field(..., description="Issue title")
    severity: str = Field(..., description="Issue severity: high, medium, low")
    description: str = Field(..., description="Issue description")


class AuditFix(BaseModel):
    title: str = Field(..., description="Fix title")
    cost_estimate: str = Field(..., description="Estimated cost")
    description: str = Field(..., description="Fix description")


class AuditResponse(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Accessibility score (0-100)")
    issues: List[str] = Field(default_factory=list, description="List of accessibility issues")
    fixes: List[str] = Field(default_factory=list, description="List of recommended fixes")


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
