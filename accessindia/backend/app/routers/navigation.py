"""Navigation Router - Route and nearby places endpoints"""

from fastapi import APIRouter, HTTPException
from app.models import NavRouteRequest, NavRouteResponse, NavNearbyRequest, NavNearbyResponse
from app.agents.navigation_agent import get_navigation_agent
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/nav", tags=["navigation"])


@router.post("/route", response_model=NavRouteResponse)
async def get_route(request: NavRouteRequest):
    """
    Get wheelchair-accessible route.
    
    Args:
        request: NavRouteRequest with origin, destination, mode
        
    Returns:
        NavRouteResponse with route details
    """
    try:
        nav_agent = get_navigation_agent()
        result = await nav_agent.get_route(
            origin_lat=request.origin_lat,
            origin_lng=request.origin_lng,
            destination=request.destination,
            mode=request.mode
        )
        
        return NavRouteResponse(**result)
    except Exception as e:
        logger.error(f"Route endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/nearby", response_model=NavNearbyResponse)
async def get_nearby(request: NavNearbyRequest):
    """
    Find nearby accessible facilities.
    
    Args:
        request: NavNearbyRequest with location and place type
        
    Returns:
        NavNearbyResponse with list of places
    """
    try:
        nav_agent = get_navigation_agent()
        result = await nav_agent.get_nearby_places(
            lat=request.lat,
            lng=request.lng,
            place_type=request.place_type,
            radius=request.radius
        )
        
        return NavNearbyResponse(**result)
    except Exception as e:
        logger.error(f"Nearby endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
