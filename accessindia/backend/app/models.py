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
    confidence: float = Field(default=0.90, ge=0.0, le=1.0, description="Analysis confidence")


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


class NavRouteStep(BaseModel):
    """Individual navigation step"""
    instruction: str = Field(..., description="Step instruction")
    distance: str = Field(..., description="Step distance")
    duration: str = Field(..., description="Step duration")


class NavRouteResponse(BaseModel):
    """Navigation route response"""
    distance: str = Field(..., description="Total distance")
    duration: str = Field(..., description="Estimated duration")
    steps: List[NavRouteStep] = Field(default_factory=list, description="Step-by-step directions")


class AuditResponse(BaseModel):
    """Accessibility audit response"""
    score: int = Field(..., ge=0, le=100, description="Accessibility score")
    issues: List[str] = Field(default_factory=list, description="List of accessibility issues")
    fixes: List[str] = Field(default_factory=list, description="List of recommended fixes")
