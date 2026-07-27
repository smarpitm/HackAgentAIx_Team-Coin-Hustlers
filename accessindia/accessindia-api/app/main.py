import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import chat, vision, navigation, audit

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("accessindia")

app = FastAPI(
    title="AccessIndia AI API",
    description="Multi-agent accessibility platform powering vision, speech, gesture, navigation, and audit capabilities.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router)
app.include_router(vision.router)
app.include_router(navigation.router)
app.include_router(audit.router)


@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for checking system status."""
    return {
        "status": "healthy",
        "service": "AccessIndia AI API",
        "version": "1.0.0",
        "gemini_api_configured": bool(settings.GEMINI_API_KEY),
        "maps_api_configured": bool(settings.GOOGLE_MAPS_API_KEY)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
