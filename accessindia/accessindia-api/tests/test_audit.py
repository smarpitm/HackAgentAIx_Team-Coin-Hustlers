def test_audit_invalid_format(client):
    """Test that uploading a text file to audit endpoint returns 400."""
    response = client.post(
        "/api/audit/analyze",
        files={"file": ("test.txt", b"this is not an image", "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
