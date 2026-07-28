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


def test_vision_valid_image(client):
    """Test uploading a valid PNG image returns vision analysis payload."""
    png_bytes = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc` \x05\x00\x00\x04\x00\x01\xdd\x8d\xb4\x1d\x00\x00\x00\x00IEND\xaeB`\x82'
    response = client.post(
        "/api/vision/analyze",
        files={"file": ("sample.png", png_bytes, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "ocr_text" in data
    assert "description" in data
    assert "detected_items" in data
    assert isinstance(data["detected_items"], list)

