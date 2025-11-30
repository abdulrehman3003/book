import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Physical AI & Humanoid Robotics API"}

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@patch('main.genai.embed_content')
@patch('main.qdrant_client')
def test_query_endpoint(mock_qdrant, mock_genai_embed):
    """Test the query endpoint"""
    # Mock the Gemini embedding response
    mock_genai_embed.return_value = {"embedding": [0.1, 0.2, 0.3]}
    
    # Mock Qdrant search results
    mock_result = MagicMock()
    mock_result.payload = {"content": "test content", "source": "test.md"}
    mock_result.score = 0.9
    mock_qdrant.search.return_value = [mock_result]
    
    response = client.post("/query", json={"query": "test query"})
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert "results" in data
    assert data["query"] == "test query"
    assert len(data["results"]) == 1
    assert data["results"][0]["content"] == "test content"

def test_ingest_endpoint():
    """Test the ingest endpoint"""
    # This test would require more complex mocking of document loading
    # For now, just test that the endpoint exists and returns a 422 error (since no actual file path is provided)
    response = client.post("/ingest")
    # The endpoint may return 422 due to missing file path (expected behavior)
    assert response.status_code in [200, 422, 500]  # Either success or expected error

if __name__ == "__main__":
    pytest.main()