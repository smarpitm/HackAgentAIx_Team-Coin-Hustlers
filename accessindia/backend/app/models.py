"""Pydantic models for AccessIndia AI API"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    """Chat request from user"""
    message: str = Field(..., max_length=1000, description="User message")
    session_id: Optional[str] = Field(None, description="Session ID for conversation tracking")


class ChatResponse(BaseModel):
    """Orchestrator response with routing information"""
    intent: Literal["VISION", "COMMUNICATION", "NAVIGATION", "AUDIT", "GENERAL"] = Field(
        ..., description="Classified user intent"
    )
    agent: str = Field(..., description="Agent name that handled the request")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Classification confidence")
    message: str = Field(..., description="Agent response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional structured data")


class VisionResponse(BaseModel):
    """Vision agent response"""
    ocr_text: str = Field(..., description="Extracted text from image")
    description: str = Field(..., description="Scene description")
    detected_items: List[str] = Field(default_factory=list, description="Detected objects")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Analysis confidence")


class NavRouteRequest(BaseModel):
    """Navigation route request"""
    origin_lat: float = Field(..., ge=-90, le=90, description="Origin latitude")
    origin_lng: float = Field(..., ge=-180, le=180, description="Origin longitude")
    destination: str = Field(..., description="Destination address or place")
    mode: str = Field(default="walking", description="Travel mode")
    
    @field_validator("mode")
    @classmethod
    def validate_mode(cls, v: str) -> str:
        """Validate travel mode"""
        allowed = ["walking", "driving", "transit"]
        if v.lower() not in allowed:
            raise ValueError(f"Mode must be one of {allowed}")
        return v.lower()


class NavRouteResponse(BaseModel):
    """Navigation route response"""
    distance: str = Field(..., description="Total distance")
    duration: str = Field(..., description="Estimated duration")
    steps: List[Dict[str, Any]] = Field(default_factory=list, description="Step-by-step directions")
    polyline: str = Field(..., description="Encoded polyline for map display")
    wheelchair_accessible: bool = Field(default=True, description="Wheelchair accessibility flag")


class NavNearbyRequest(BaseModel):
    """Nearby places request"""
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lng: float = Field(..., ge=-180, le=180, description="Longitude")
    place_type: str = Field(default="hospital", description="Type of place to search")
    radius: int = Field(default=1000, ge=100, le=5000, description="Search radius in meters")


class NavNearbyResponse(BaseModel):
    """Nearby places response"""
    places: List[Dict[str, Any]] = Field(default_factory=list, description="List of nearby places")


class AuditIssue(BaseModel):
    """Accessibility audit issue"""
    category: str = Field(..., description="Issue category")
    description: str = Field(..., description="Issue description")
    severity: Literal["critical", "major", "minor"] = Field(..., description="Issue severity")


class AuditFix(BaseModel):
    """Accessibility fix suggestion"""
    issue_category: str = Field(..., description="Related issue category")
    fix_description: str = Field(..., description="Fix description")
    estimated_cost: str = Field(..., description="Estimated cost range")


class AuditResponse(BaseModel):
    """Accessibility audit response"""
    score: int = Field(..., ge=0, le=100, description="Accessibility score")
    issues: List[AuditIssue] = Field(default_factory=list, description="List of issues")
    fixes: List[AuditFix] = Field(default_factory=list, description="Fix suggestions")
    summary: str = Field(..., description="Overall assessment summary")
