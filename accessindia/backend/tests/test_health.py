"""Health check tests"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check(client=None):
    """Test health check endpoint returns status ok."""
    test_client = client or TestClient(app)
    response = test_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "accessindia-ai"
