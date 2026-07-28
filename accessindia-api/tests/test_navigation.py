def test_nav_route(client):
    """Test route endpoint with valid coordinates returns distance, duration, and steps."""
    response = client.post("/api/nav/route", json={
        "origin_lat": 28.6139,
        "origin_lng": 77.2090,
        "destination": "AIIMS Delhi",
        "mode": "walking"
    })
    assert response.status_code == 200
    data = response.json()
    assert "distance" in data
    assert "duration" in data
    assert "steps" in data
    assert len(data["steps"]) > 0


def test_nav_nearby(client):
    """Test nearby endpoint with valid lat/lng returns places."""
    response = client.get("/api/nav/nearby?lat=28.6139&lng=77.2090&radius=2000&type=hospital")
    assert response.status_code == 200
    data = response.json()
    assert "places" in data


def test_nav_invalid_coords(client):
    """Test that lat=999 returns 422 validation error."""
    response = client.get("/api/nav/nearby?lat=999&lng=77.2090")
    assert response.status_code == 422
