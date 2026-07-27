"""
Configuration module for AccessIndia AI backend.
Manages environment variables and application settings.
"""

from functools import lru_cache
from typing import List
from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Attributes:
        gemini_api_key: Google Generative AI API key (optional, falls back gracefully)
        google_maps_api_key: Google Maps API key (optional, falls back gracefully)
        cors_origins: List of allowed CORS origins (default: localhost:5173)
    """
    
    # API Keys (sensitive - use SecretStr, optional with empty default)
    gemini_api_key: SecretStr = Field(
        default=SecretStr(""),
        description="Google Generative AI (Gemini) API key - SENSITIVE"
    )
    
    google_maps_api_key: SecretStr = Field(
        default=SecretStr(""),
        description="Google Maps JavaScript API key - SENSITIVE"
    )
    
    # CORS Configuration
    cors_origins: List[str] = Field(
        default=["http://localhost:5173"],
        description="Allowed CORS origins for frontend connections"
    )
    
    # Pydantic v2 configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v) -> List[str]:
        """Parse CORS origins from comma-separated string or list."""
        if isinstance(v, str):
            # Split by comma and strip whitespace
            origins = [origin.strip() for origin in v.split(",") if origin.strip()]
            return origins if origins else ["http://localhost:5173"]
        return v
    
    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, v: List[str]) -> List[str]:
        """Validate CORS origins are valid URLs."""
        for origin in v:
            if not origin.startswith(("http://", "https://")):
                raise ValueError(f"Invalid CORS origin '{origin}': must start with http:// or https://")
            if not origin or origin.strip() != origin:
                raise ValueError(f"Invalid CORS origin: cannot be empty or contain leading/trailing whitespace")
        
        # Limit to 20 origins maximum
        if len(v) > 20:
            raise ValueError(f"Too many CORS origins: maximum 20 allowed, got {len(v)}")
        
        return v


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Get application settings singleton.
    
    This function uses lru_cache to ensure only one Settings instance
    is created during the application lifetime. The instance is cached
    and reused across all imports.
    
    Returns:
        Settings: Cached settings instance
        
    Raises:
        ValidationError: If required environment variables are missing
                        or validation fails
    """
    return Settings()


# Export settings instance for convenience
settings = get_settings()
