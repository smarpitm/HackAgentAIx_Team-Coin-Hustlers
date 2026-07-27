def test_vision_invalid_format(client):
    """Test that uploading a text file returns 400."""
    response = client.post(
        "/api/vision/analyze",
        files={"file": ("test.txt", b"this is not an image", "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_vision_no_file(client):
    """Test that calling vision analyze without a file returns 422."""
    response = client.post("/api/vision/analyze")
    assert response.status_code == 422
