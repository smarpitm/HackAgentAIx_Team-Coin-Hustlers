"""Vision endpoint tests"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_vision_invalid_format(client=None):
    """Test that uploading a text file returns 400."""
    test_client = client or TestClient(app)
    response = test_client.post(
        "/api/vision/analyze",
        files={"file": ("test.txt", b"this is not an image", "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_vision_no_file(client=None):
    """Test that calling vision analyze without a file returns 422."""
    test_client = client or TestClient(app)
    response = test_client.post("/api/vision/analyze")
    assert response.status_code == 422
