"""Navigation Agent - Accessible routes and nearby facility search"""

import logging
from typing import List, Dict, Any

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

from app.config import get_settings
from app.models import NavRouteRequest, NavRouteResponse, NavRouteStep

logger = logging.getLogger(__name__)


class NavigationAgent:
    """Provides accessible routes and nearby place search using Google Maps API."""

    def __init__(self):
        self.settings = get_settings()
        logger.info("Navigation Agent initialized")

    async def get_route(self, req: NavRouteRequest) -> NavRouteResponse:
        """Get accessible route using Google Maps Directions API.

        Falls back to mock data (2.3km, 28min, 5 steps) on failure.

        Args:
            req: NavRouteRequest with origin_lat, origin_lng, destination, mode

        Returns:
            NavRouteResponse with distance, duration, steps
        """
        api_key = self.settings.google_maps_api_key.get_secret_value()
        if api_key and REQUESTS_AVAILABLE:
            try:
                url = "https://maps.googleapis.com/maps/api/directions/json"
                params = {
                    "origin": f"{req.origin_lat},{req.origin_lng}",
                    "destination": req.destination,
                    "mode": req.mode,
                    "key": api_key
                }
                res = requests.get(url, params=params, timeout=5)
                data = res.json()

                if data.get("status") == "OK" and len(data.get("routes", [])) > 0:
                    route = data["routes"][0]
                    leg = route["legs"][0]
                    steps = []
                    for s in leg.get("steps", []):
                        clean_inst = s.get("html_instructions", "")
                        clean_inst = clean_inst.replace("<b>", "").replace("</b>", "")
                        clean_inst = clean_inst.replace('<div style="font-size:0.9em">', " - ")
                        clean_inst = clean_inst.replace("</div>", "")
                        steps.append(NavRouteStep(
                            instruction=clean_inst,
                            distance=s.get("distance", {}).get("text", ""),
                            duration=s.get("duration", {}).get("text", "")
                        ))

                    return NavRouteResponse(
                        distance=leg.get("distance", {}).get("text", "2.3 km"),
                        duration=leg.get("duration", {}).get("text", "28 min"),
                        steps=steps
                    )
            except Exception as e:
                logger.warning(f"Google Maps API error: {e}")

        # Mock fallback data (2.3km, 28min, 5 steps)
        return NavRouteResponse(
            distance="2.3 km",
            duration="28 min",
            steps=[
                NavRouteStep(instruction="Start at current location", distance="0 km", duration="0 min"),
                NavRouteStep(instruction="Head north on Main Road towards the junction", distance="0.5 km", duration="6 min"),
                NavRouteStep(instruction="Turn right onto Park Avenue", distance="1.0 km", duration="12 min"),
                NavRouteStep(instruction="Continue straight past the traffic signal", distance="0.6 km", duration="8 min"),
                NavRouteStep(instruction="Arrive at destination on the left", distance="0.2 km", duration="2 min"),
            ]
        )

    async def get_nearby(self, lat: float, lng: float, radius: int = 2000, type_: str = "hospital") -> list:
        """Find nearby places using Google Maps Places API.

        Args:
            lat: Latitude of search center
            lng: Longitude of search center
            radius: Search radius in meters (default 2000)
            type_: Place type to search (default "hospital")

        Returns:
            List of dicts with name, address, rating, lat, lng, wheelchair_accessible
        """
        api_key = self.settings.google_maps_api_key.get_secret_value()
        if api_key and REQUESTS_AVAILABLE:
            try:
                url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                params = {
                    "location": f"{lat},{lng}",
                    "radius": radius,
                    "type": type_,
                    "key": api_key
                }
                res = requests.get(url, params=params, timeout=5)
                data = res.json()

                if data.get("status") == "OK":
                    places = []
                    for place in data.get("results", [])[:10]:
                        places.append({
                            "name": place.get("name", ""),
                            "address": place.get("vicinity", ""),
                            "rating": place.get("rating", 0.0),
                            "lat": place["geometry"]["location"]["lat"],
                            "lng": place["geometry"]["location"]["lng"],
                            "wheelchair_accessible": False
                        })
                    return places
            except Exception as e:
                logger.warning(f"Google Places API error: {e}")

        return []


# Singleton instance
navigation_agent = NavigationAgent()
