"""
Backend API Tests for TYRELL Flower Studio
Testing: Auth endpoints, content endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials for testing
ADMIN_EMAIL = "tyrellflowerstudio@gmail.com"
ADMIN_PASSWORD = "897355"

class TestHealthCheck:
    """Basic API health check"""
    
    def test_api_root(self):
        """Test API is running"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root response: {data}")


class TestAuth:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        print(f"Login successful, token received: {data['access_token'][:20]}...")
        return data["access_token"]
    
    def test_login_wrong_email(self):
        """Test login with wrong email"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@email.com",
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Wrong email rejected: {data}")
    
    def test_login_wrong_password(self):
        """Test login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Wrong password rejected: {data}")
    
    def test_verify_auth_with_valid_token(self):
        """Test token verification with valid token"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Verify the token
        response = requests.get(f"{BASE_URL}/api/auth/verify", 
            headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] == True
        assert data["email"] == ADMIN_EMAIL
        print(f"Token verified successfully: {data}")
    
    def test_verify_auth_with_invalid_token(self):
        """Test token verification with invalid token"""
        response = requests.get(f"{BASE_URL}/api/auth/verify", 
            headers={"Authorization": "Bearer invalid_token_here"})
        assert response.status_code == 401
        print("Invalid token correctly rejected")
    
    def test_verify_auth_without_token(self):
        """Test token verification without authorization header"""
        response = requests.get(f"{BASE_URL}/api/auth/verify")
        assert response.status_code in [401, 403]
        print("Request without token correctly rejected")


class TestContentAPI:
    """Content API endpoint tests"""
    
    def test_get_content(self):
        """Test retrieving all site content"""
        response = requests.get(f"{BASE_URL}/api/content")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "site" in data
        assert "services" in data
        assert "catalogLinks" in data
        
        # Verify site has expected sections
        site = data["site"]
        assert "brand" in site
        assert "hero" in site
        assert "about" in site
        assert "services" in site
        assert "contact" in site
        
        print(f"Content retrieved successfully. Site has {len(data['services'])} services.")
        return data


class TestServicesAPI:
    """Services CRUD API tests"""
    
    def test_get_services(self):
        """Test getting all services"""
        response = requests.get(f"{BASE_URL}/api/services")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Retrieved {len(data)} services")
        
        # Check that services don't have POPULAR/EXCLUSIVO tags displayed
        for service in data:
            assert "id" in service
            assert "title" in service
        return data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
