from fastapi import APIRouter, HTTPException, Query
from app.models import NavRouteRequest, NavRouteResponse
from app.agents.navigation_agent import navigation_agent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/nav", tags=["navigation"])


@router.post("/route")
async def get_route(request: NavRouteRequest):
    """Get an accessible route between two points."""
    try:
        result = navigation_agent.get_route(request)
        # result may be a NavRouteResponse or an enriched dict with route_coords
        if hasattr(result, 'model_dump'):
            return result.model_dump()
        return result
    except Exception as e:
        logger.error(f"Navigation routing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Route calculation failed: {str(e)}")


@router.get("/nearby")
async def get_nearby(
    lat: float = Query(..., ge=-90, le=90, description="Latitude of search center"),
    lng: float = Query(..., ge=-180, le=180, description="Longitude of search center"),
    radius: int = Query(default=2000, ge=100, le=5000, description="Search radius in meters"),
    type: str = Query(default="hospital", description="Type of place to search for"),
):
    """Find nearby accessible facilities and places."""
    try:
        places = navigation_agent.get_nearby(lat, lng, radius, type)
        return {"places": places}
    except Exception as e:
        logger.error(f"Nearby search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Nearby search failed: {str(e)}")
