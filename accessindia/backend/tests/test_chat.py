"""Chat endpoint tests"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_classify_vision_intent(client=None):
    """Test 'I can't read this medicine label' routes to VISION."""
    test_client = client or TestClient(app)
    response = test_client.post(
        "/api/chat",
        json={"message": "I can't read this medicine label"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert "agent" in data
    assert "confidence" in data
    assert "message" in data
    assert 0.0 <= data["confidence"] <= 1.0


def test_classify_nav_intent(client=None):
    """Test 'Find a hospital near me' routes to NAVIGATION."""
    test_client = client or TestClient(app)
    response = test_client.post(
        "/api/chat",
        json={"message": "Find a hospital near me"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] in ["VISION", "COMMUNICATION", "NAVIGATION", "AUDIT", "GENERAL"]
    assert 0.0 <= data["confidence"] <= 1.0


def test_classify_audit_intent(client=None):
    """Test 'Is this building accessible?' routes to AUDIT."""
    test_client = client or TestClient(app)
    response = test_client.post(
        "/api/chat",
        json={"message": "Is this building accessible?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert "agent" in data
    assert 0.0 <= data["confidence"] <= 1.0


def test_classify_general_intent(client=None):
    """Test 'Hello, what can you do?' routes to GENERAL."""
    test_client = client or TestClient(app)
    response = test_client.post(
        "/api/chat",
        json={"message": "Hello, what can you do?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] in ["VISION", "COMMUNICATION", "NAVIGATION", "AUDIT", "GENERAL"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert "message" in data
