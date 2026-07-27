"""Audit endpoint tests"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_audit_invalid_format(client=None):
    """Test that uploading a text file to audit endpoint returns 400."""
    test_client = client or TestClient(app)
    response = test_client.post(
        "/api/audit/analyze",
        files={"file": ("test.txt", b"this is not an image", "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
