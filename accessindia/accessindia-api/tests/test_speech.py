def test_speech_transcribe_invalid_file(client):
    """Test that uploading a non-audio file returns 400."""
    response = client.post(
        "/api/speech/transcribe",
        files={"file": ("test.txt", b"not audio data", "text/plain")}
    )
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data


def test_speech_transcribe_valid_audio(client):
    """Test uploading an audio file returns transcription structure."""
    dummy_webm = b"1234567890" * 20
    response = client.post(
        "/api/speech/transcribe",
        files={"file": ("sample.webm", dummy_webm, "audio/webm")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "transcript" in data
    assert "confidence" in data
    assert "engine" in data
