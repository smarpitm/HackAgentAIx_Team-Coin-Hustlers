def test_audit_invalid_format(client):
    """Test that uploading a text file to audit endpoint returns 400."""
    response = client.post(
        "/api/audit/analyze",
        files={"file": ("test.txt", b"this is not an image", "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_audit_valid_image(client):
    """Test uploading a valid building PNG image returns audit score, issues, and fixes."""
    png_bytes = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc` \x05\x00\x00\x04\x00\x01\xdd\x8d\xb4\x1d\x00\x00\x00\x00IEND\xaeB`\x82'
    response = client.post(
        "/api/audit/analyze",
        files={"file": ("building.png", png_bytes, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert isinstance(data["score"], (int, float))
    assert 0 <= data["score"] <= 100
    assert "issues" in data
    assert isinstance(data["issues"], list)
    assert "fixes" in data
    assert isinstance(data["fixes"], list)

