"""Chat endpoint tests"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_chat_vision_intent():
    """Test chat with vision-related message"""
    response = client.post(
        "/api/chat",
        json={"message": "Can you help me read this image?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert "agent" in data
    assert "confidence" in data
    assert "message" in data
    assert 0.0 <= data["confidence"] <= 1.0


def test_chat_navigation_intent():
    """Test chat with navigation-related message"""
    response = client.post(
        "/api/chat",
        json={"message": "Find me a wheelchair accessible route to the hospital"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert data["intent"] in ["VISION", "COMMUNICATION", "NAVIGATION", "AUDIT", "GENERAL"]


def test_chat_general_intent():
    """Test chat with general message"""
    response = client.post(
        "/api/chat",
        json={"message": "Hello, how are you?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert "message" in data


def test_chat_with_session_id():
    """Test chat with session ID"""
    response = client.post(
        "/api/chat",
        json={"message": "Help me navigate", "session_id": "test-session-123"}
    )
    assert response.status_code == 200


def test_chat_message_too_long():
    """Test chat with message exceeding max length"""
    long_message = "a" * 1001
    response = client.post(
        "/api/chat",
        json={"message": long_message}
    )
    assert response.status_code == 422  # Validation error
