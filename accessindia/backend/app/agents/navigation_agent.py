"""Navigation Agent - Wheelchair-friendly routes and accessible facilities"""

import logging
from typing import Dict, Any, List, Tuple

logger = logging.getLogger(__name__)


class NavigationAgent:
    """Provides wheelchair-accessible navigation using Google Maps API"""
    
    def __init__(self):
        # Google Maps integration would go here
        # For now, using mock data structure
        self.maps_available = False
        logger.info("Navigation Agent initialized (mock mode)")
    
    async def get_route(
        self,
        origin_lat: float,
        origin_lng: float,
        destination: str,
        mode: str = "walking"
    ) -> Dict[str, Any]:
        """
        Get wheelchair-accessible route.
        
        Args:
            origin_lat: Starting latitude
            origin_lng: Starting longitude
            destination: Destination address
            mode: Travel mode (walking, driving, transit)
            
        Returns:
            Dict with distance, duration, steps, polyline
        """
        # Mock response (replace with actual Google Maps API call)
        return {
            "distance": "2.5 km",
            "duration": "15 minutes",
            "wheelchair_accessible": True,
            "steps": [
                {
                    "instruction": "Head north on Main Street",
                    "distance": "500 m",
                    "duration": "3 min",
                    "accessibility_note": "Wide sidewalk, no stairs"
                },
                {
                    "instruction": "Turn right onto Accessible Avenue",
                    "distance": "1.2 km",
                    "duration": "7 min",
                    "accessibility_note": "Ramp available, smooth surface"
                },
                {
                    "instruction": "Arrive at destination",
                    "distance": "800 m",
                    "duration": "5 min",
                    "accessibility_note": "Elevator access available"
                }
            ],
            "polyline": "mock_encoded_polyline_string",
            "warnings": [],
            "notes": "Route optimized for wheelchair accessibility. Avoid steep inclines and stairs."
        }
    
    async def get_nearby_places(
        self,
        lat: float,
        lng: float,
        place_type: str = "hospital",
        radius: int = 1000
    ) -> Dict[str, Any]:
        """
        Find nearby accessible facilities.
        
        Args:
            lat: Latitude
            lng: Longitude
            place_type: Type of place (hospital, pharmacy, restaurant, etc.)
            radius: Search radius in meters
            
        Returns:
            Dict with list of places
        """
        # Mock response (replace with actual Google Maps Places API call)
        return {
            "places": [
                {
                    "name": f"Accessible {place_type.title()} 1",
                    "address": "123 Barrier-Free Street",
                    "distance": "350 m",
                    "rating": 4.5,
                    "wheelchair_accessible": True,
                    "has_accessible_parking": True,
                    "has_accessible_restroom": True,
                    "phone": "+91-11-1234-5678",
                    "lat": lat + 0.003,
                    "lng": lng + 0.003
                },
                {
                    "name": f"Accessible {place_type.title()} 2",
                    "address": "456 Ramp Avenue",
                    "distance": "720 m",
                    "rating": 4.2,
                    "wheelchair_accessible": True,
                    "has_accessible_parking": True,
                    "has_accessible_restroom": False,
                    "phone": "+91-11-8765-4321",
                    "lat": lat - 0.005,
                    "lng": lng + 0.002
                }
            ],
            "total_results": 2,
            "search_center": {"lat": lat, "lng": lng},
            "radius_km": radius / 1000
        }


# Singleton instance
_navigation_agent = None

def get_navigation_agent() -> NavigationAgent:
    """Get singleton navigation agent instance"""
    global _navigation_agent
    if _navigation_agent is None:
        _navigation_agent = NavigationAgent()
    return _navigation_agent
