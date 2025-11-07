"""
Pytest configuration and fixtures
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """Test client fixture"""
    return TestClient(app)

@pytest.fixture
def test_user():
    """Test user fixture"""
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "Test1234"
    }
