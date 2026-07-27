"""Navigation Router - Route and nearby places endpoints"""

from fastapi import APIRouter, HTTPException, Query
from app.models import NavRouteRequest, NavRouteResponse
from app.agents.navigation_agent import navigation_agent
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/nav", tags=["navigation"])


@router.post("/route", response_model=NavRouteResponse)
async def get_route(request: NavRouteRequest):
    """Get wheelchair-accessible route between two points.

    Args:
        request: NavRouteRequest with origin_lat, origin_lng, destination, mode

    Returns:
        NavRouteResponse with route details
    """
    try:
        result = await navigation_agent.get_route(request)
        return result
    except Exception as e:
        logger.error(f"Route endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Route calculation failed: {str(e)}")


@router.get("/nearby")
async def get_nearby(
    lat: float = Query(..., ge=-90, le=90, description="Latitude of search center"),
    lng: float = Query(..., ge=-180, le=180, description="Longitude of search center"),
    radius: int = Query(default=2000, ge=100, le=5000, description="Search radius in meters"),
    type: str = Query(default="hospital", description="Type of place to search for"),
):
    """Find nearby accessible facilities and places.

    Args:
        lat: Latitude of search center
        lng: Longitude of search center
        radius: Search radius in meters (default 2000)
        type: Type of place to search (default "hospital")

    Returns:
        Dict with list of places
    """
    try:
        places = await navigation_agent.get_nearby(lat, lng, radius, type)
        return {"places": places}
    except Exception as e:
        logger.error(f"Nearby endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Nearby search failed: {str(e)}")
