from fastapi import APIRouter, HTTPException
from app.models import NavRequest, NavResponse, NearbyRequest
from app.agents.navigation_agent import get_accessible_route, get_nearby_accessible_facilities

router = APIRouter(prefix="/api/nav", tags=["Navigation Agent"])


@router.post("/route", response_model=NavResponse)
async def fetch_accessible_route(payload: NavRequest):
    """Calculates accessible routes with low incline, elevators, and tactile paths."""
    try:
        route_data = get_accessible_route(payload.origin, payload.destination, payload.mode or "transit")
        return NavResponse(**route_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Navigation routing failed: {str(e)}")


@router.post("/nearby")
async def fetch_nearby_facilities(payload: NearbyRequest):
    """Finds accessible public restrooms, ramps, elevators, and transit hubs near coordinates."""
    try:
        facilities = get_nearby_accessible_facilities(
            payload.latitude,
            payload.longitude,
            payload.facility_type or "accessible_restroom"
        )
        return {"status": "success", "facilities": facilities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Nearby search failed: {str(e)}")
