import logging
import math
from typing import List, Dict, Any

import requests
from app.config import settings
from app.models import NavRouteRequest, NavRouteResponse, NavRouteStep

logger = logging.getLogger(__name__)

# Headers required by Nominatim usage policy
NOMINATIM_HEADERS = {
    "User-Agent": "AccessIndiaAI/1.0 (accessibility-hackathon)"
}


class NavigationAgent:
    """Navigation Agent for AccessIndia AI — provides accessible routes and nearby facility search
    using OpenStreetMap Nominatim (geocoding) and OSRM (routing). 100% free, no API key required."""

    def _geocode(self, place_name: str) -> dict | None:
        """Geocode a place name to lat/lng using Nominatim."""
        try:
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": place_name,
                "format": "json",
                "limit": 1,
                "countrycodes": "in",  # Bias results to India
            }
            res = requests.get(url, params=params, headers=NOMINATIM_HEADERS, timeout=5)
            data = res.json()
            if data and len(data) > 0:
                return {
                    "lat": float(data[0]["lat"]),
                    "lng": float(data[0]["lon"]),
                    "display_name": data[0].get("display_name", place_name),
                }
        except Exception as e:
            logger.warning(f"Nominatim geocoding error: {e}")
        return None

    def get_route(self, req: NavRouteRequest) -> NavRouteResponse:
        """Get accessible walking route using OSRM (Open Source Routing Machine).

        1. Geocodes destination via Nominatim
        2. Queries OSRM for walking route with step-by-step instructions
        3. Falls back to mock data on failure

        Args:
            req: NavRouteRequest with origin_lat, origin_lng, destination, mode

        Returns:
            NavRouteResponse with distance, duration, steps, and optional route_coords/dest coords
        """
        try:
            # Step 1: Geocode destination
            dest = self._geocode(req.destination)
            if not dest:
                logger.warning(f"Could not geocode destination: {req.destination}")
                return self._fallback_route()

            # Step 2: Query OSRM for walking route
            profile = "foot" if req.mode == "walking" else "car"
            osrm_url = (
                f"https://router.project-osrm.org/route/v1/{profile}/"
                f"{req.origin_lng},{req.origin_lat};{dest['lng']},{dest['lat']}"
            )
            params = {
                "overview": "full",
                "geometries": "geojson",
                "steps": "true",
            }
            res = requests.get(osrm_url, params=params, timeout=8)
            data = res.json()

            if data.get("code") == "Ok" and data.get("routes"):
                osrm_route = data["routes"][0]
                total_distance_m = osrm_route.get("distance", 0)
                total_duration_s = osrm_route.get("duration", 0)

                # Format distance and duration
                if total_distance_m >= 1000:
                    dist_str = f"{total_distance_m / 1000:.1f} km"
                else:
                    dist_str = f"{int(total_distance_m)} m"

                dur_minutes = int(total_duration_s / 60)
                if dur_minutes >= 60:
                    dur_str = f"{dur_minutes // 60}h {dur_minutes % 60} min"
                else:
                    dur_str = f"{dur_minutes} min"

                # Extract step-by-step instructions
                steps = []
                legs = osrm_route.get("legs", [])
                for leg in legs:
                    for s in leg.get("steps", []):
                        maneuver = s.get("maneuver", {})
                        instruction = s.get("name", "")
                        modifier = maneuver.get("modifier", "")
                        m_type = maneuver.get("type", "")

                        # Build human-readable instruction
                        if m_type == "depart":
                            inst_text = f"Start walking on {instruction}" if instruction else "Start walking"
                        elif m_type == "arrive":
                            inst_text = "Arrive at destination"
                        elif m_type == "turn":
                            inst_text = f"Turn {modifier} onto {instruction}" if instruction else f"Turn {modifier}"
                        elif m_type == "continue":
                            inst_text = f"Continue on {instruction}" if instruction else "Continue straight"
                        elif m_type == "roundabout" or m_type == "rotary":
                            inst_text = f"Enter roundabout, take exit onto {instruction}" if instruction else "Enter roundabout"
                        else:
                            inst_text = f"{m_type.replace('_', ' ').capitalize()} {modifier} {instruction}".strip()

                        step_dist_m = s.get("distance", 0)
                        step_dur_s = s.get("duration", 0)
                        step_dist = f"{step_dist_m / 1000:.1f} km" if step_dist_m >= 1000 else f"{int(step_dist_m)} m"
                        step_dur = f"{int(step_dur_s / 60)} min" if step_dur_s >= 60 else f"{int(step_dur_s)} sec"

                        if step_dist_m > 0:  # Skip zero-distance steps
                            steps.append(NavRouteStep(
                                instruction=inst_text,
                                distance=step_dist,
                                duration=step_dur,
                            ))

                # Extract route polyline coordinates for frontend map
                route_coords = osrm_route.get("geometry", {}).get("coordinates", [])

                response = NavRouteResponse(
                    distance=dist_str,
                    duration=dur_str,
                    steps=steps if steps else [NavRouteStep(instruction="Walk to destination", distance=dist_str, duration=dur_str)],
                )
                # Attach extra fields for frontend map (not in pydantic model, but serialized via dict)
                response_dict = response.model_dump()
                response_dict["route_coords"] = route_coords
                response_dict["dest_lat"] = dest["lat"]
                response_dict["dest_lng"] = dest["lng"]
                return response_dict

        except Exception as e:
            logger.warning(f"OSRM routing error: {e}")

        return self._fallback_route()

    def _fallback_route(self) -> NavRouteResponse:
        """Return mock fallback data when routing APIs are unavailable."""
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

    def get_nearby(self, lat: float, lng: float, radius: int = 2000, type_: str = "hospital") -> list:
        """Find nearby places using OpenStreetMap Overpass API (free, no key required).

        Args:
            lat: Latitude of search center
            lng: Longitude of search center
            radius: Search radius in meters (default 2000)
            type_: Place type to search (default "hospital")

        Returns:
            List of dicts with name, address, rating, lat, lng, wheelchair_accessible
        """
        try:
            # Map common types to OSM amenity tags
            osm_tag_map = {
                "hospital": "amenity=hospital",
                "pharmacy": "amenity=pharmacy",
                "clinic": "amenity=clinic",
                "restaurant": "amenity=restaurant",
                "school": "amenity=school",
                "bank": "amenity=bank",
                "bus_station": "amenity=bus_station",
                "parking": "amenity=parking",
            }
            osm_tag = osm_tag_map.get(type_, f"amenity={type_}")
            tag_key, tag_value = osm_tag.split("=")

            # Overpass QL query
            overpass_url = "https://overpass-api.de/api/interpreter"
            query = f"""
            [out:json][timeout:10];
            (
              node["{tag_key}"="{tag_value}"](around:{radius},{lat},{lng});
              way["{tag_key}"="{tag_value}"](around:{radius},{lat},{lng});
            );
            out center 10;
            """
            res = requests.post(overpass_url, data={"data": query}, timeout=10)
            data = res.json()

            places = []
            for element in data.get("elements", [])[:10]:
                tags = element.get("tags", {})
                e_lat = element.get("lat") or element.get("center", {}).get("lat")
                e_lng = element.get("lon") or element.get("center", {}).get("lon")

                if e_lat and e_lng:
                    wheelchair = tags.get("wheelchair", "")
                    places.append({
                        "name": tags.get("name", f"Unnamed {type_.capitalize()}"),
                        "address": tags.get("addr:full", tags.get("addr:street", "")),
                        "rating": None,  # OSM doesn't have ratings
                        "lat": float(e_lat),
                        "lng": float(e_lng),
                        "wheelchair_accessible": wheelchair in ("yes", "limited"),
                    })
            return places

        except Exception as e:
            logger.warning(f"Overpass API error: {e}")

        return []


# Singleton instance
navigation_agent = NavigationAgent()
