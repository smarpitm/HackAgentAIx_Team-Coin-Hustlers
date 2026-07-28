import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import chat, vision, navigation, audit, speech

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("accessindia")

app = FastAPI(
    title="AccessIndia AI",
    description="Multi-agent accessibility platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router)
app.include_router(vision.router)
app.include_router(navigation.router)
app.include_router(audit.router)
app.include_router(speech.router)


@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "accessindia-ai"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
