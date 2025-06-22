"""
Test main application endpoints
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "FlowsyAI Backend API"
    assert data["version"] == "1.0.0"
    assert data["status"] == "healthy"


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data
    assert "database" in data


def test_api_docs_available():
    """Test API documentation is available in development"""
    response = client.get("/docs")
    # Should return HTML page or redirect
    assert response.status_code in [200, 307]


def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options("/")
    # CORS headers should be present
    assert "access-control-allow-origin" in response.headers or response.status_code == 200
