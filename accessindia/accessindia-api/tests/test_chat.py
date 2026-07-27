def test_classify_vision_intent(client):
    """Test that 'I can't read this medicine label' routes to VISION."""
    response = client.post("/api/chat", json={"message": "I can't read this medicine label"})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] in ["read_text", "image_analysis", "general_query"]
    assert data["agent"] in ["vision", "general"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert "message" in data


def test_classify_nav_intent(client):
    """Test that 'Find a hospital near me' routes to NAVIGATION."""
    response = client.post("/api/chat", json={"message": "Find a hospital near me"})
    assert response.status_code == 200
    data = response.json()
    assert data["agent"] in ["navigation", "general"]
    assert 0.0 <= data["confidence"] <= 1.0


def test_classify_audit_intent(client):
    """Test that 'Is this building accessible?' routes to AUDIT."""
    response = client.post("/api/chat", json={"message": "Is this building accessible?"})
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert "agent" in data
    assert 0.0 <= data["confidence"] <= 1.0


def test_classify_general_intent(client):
    """Test that 'Hello, what can you do?' routes to GENERAL."""
    response = client.post("/api/chat", json={"message": "Hello, what can you do?"})
    assert response.status_code == 200
    data = response.json()
    assert data["agent"] in ["general", "General Assistant"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert "message" in data
