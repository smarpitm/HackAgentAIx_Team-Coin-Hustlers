import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_chat_orchestrator_general():
    response = client.post("/api/chat", json={"message": "Hello AccessIndia AI"})
    assert response.status_code == 200
    data = response.json()
    assert "intent" in data
    assert "agent" in data
    assert "message" in data


def test_chat_orchestrator_nav():
    response = client.post("/api/chat", json={"message": "navigate to New Delhi Railway Station"})
    assert response.status_code == 200
    data = response.json()
    assert data["agent"] in ["navigation", "general"]
