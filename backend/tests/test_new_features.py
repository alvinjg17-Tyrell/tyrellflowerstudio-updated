"""
Backend API Tests for TYRELL Flower Studio - Iteration 5
Testing: Color Palette API, Dynamic Sections API, Hero without Flower Studio label
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials for testing
ADMIN_EMAIL = "tyrellflowerstudio@gmail.com"
ADMIN_PASSWORD = "897355"


def get_auth_token():
    """Helper to get auth token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    return None


class TestColorPaletteAPI:
    """Tests for Color Palette CRUD operations"""
    
    def test_get_color_palette(self):
        """Test GET /api/color-palette returns palette with all required colors"""
        response = requests.get(f"{BASE_URL}/api/color-palette")
        
        assert response.status_code == 200
        palette = response.json()
        
        # Check all required color fields exist
        required_colors = ['primary', 'primaryHover', 'secondary', 'accent', 
                          'text', 'textLight', 'background', 'backgroundAlt', 
                          'rose', 'nude']
        
        for color_key in required_colors:
            assert color_key in palette, f"Color palette missing '{color_key}'"
            assert palette[color_key].startswith('#'), f"Color '{color_key}' should be hex format"
        
        print(f"Color palette retrieved successfully with {len(palette)} colors")
        print(f"  Primary: {palette['primary']}")
        print(f"  Secondary: {palette['secondary']}")
    
    def test_update_color_palette(self):
        """Test PUT /api/color-palette updates colors"""
        # Get current palette
        get_response = requests.get(f"{BASE_URL}/api/color-palette")
        original_palette = get_response.json()
        
        # Update with new colors
        updated_palette = {
            "primary": "#daa609",
            "primaryHover": "#b8890a",
            "secondary": "#B76E79",
            "accent": "#D4B896",
            "text": "#1a1a1a",
            "textLight": "#4F6D5E",
            "background": "#F5F1EB",
            "backgroundAlt": "#FFFFFF",
            "rose": "#D8A7B1",
            "nude": "#E8C1B5"
        }
        
        response = requests.put(f"{BASE_URL}/api/color-palette", json=updated_palette)
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "data" in data
        
        # Verify colors were updated
        for key, value in updated_palette.items():
            assert data["data"][key] == value, f"Color '{key}' not updated correctly"
        
        print("Color palette updated successfully")
    
    def test_color_palette_in_content_response(self):
        """Test that /api/content includes colorPalette in site object"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check colorPalette exists in site
        site = data.get("site", {})
        assert "colorPalette" in site, "colorPalette should be included in /api/content site"
        
        palette = site["colorPalette"]
        assert "primary" in palette
        assert "secondary" in palette
        
        print(f"colorPalette found in content response: {palette.get('primary')}")


class TestDynamicSectionsAPI:
    """Tests for Dynamic Sections CRUD operations"""
    
    def test_get_dynamic_sections(self):
        """Test GET /api/dynamic-sections returns list"""
        response = requests.get(f"{BASE_URL}/api/dynamic-sections")
        
        assert response.status_code == 200
        sections = response.json()
        assert isinstance(sections, list), "Dynamic sections should be a list"
        
        print(f"Found {len(sections)} dynamic sections")
    
    def test_create_dynamic_section(self):
        """Test POST /api/dynamic-sections creates new section"""
        new_section = {
            "title": "TEST_Promoción de Primavera",
            "subtitle": "Ofertas especiales",
            "type": "banner",
            "content": "Hasta 20% de descuento en arreglos florales",
            "image": "",
            "images": [],
            "buttonText": "Ver Ofertas",
            "buttonLink": "https://wa.me/51910770284",
            "backgroundColor": "#F5F1EB",
            "textColor": "#1a1a1a",
            "order": 0,
            "active": True
        }
        
        response = requests.post(f"{BASE_URL}/api/dynamic-sections", json=new_section)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response contains created section
        assert "id" in data, "Created section should have an ID"
        assert data["title"] == new_section["title"]
        assert data["type"] == new_section["type"]
        assert data["active"] == True
        
        # Store for cleanup
        self.__class__.created_section_id = data["id"]
        
        print(f"Created dynamic section: {data['title']} (id: {data['id']})")
        return data["id"]
    
    def test_update_dynamic_section(self):
        """Test PUT /api/dynamic-sections/{id} updates section"""
        # First create a section
        create_response = requests.post(f"{BASE_URL}/api/dynamic-sections", json={
            "title": "TEST_Update Section",
            "type": "promo",
            "active": True
        })
        section_id = create_response.json()["id"]
        
        # Update the section
        updated_data = {
            "title": "TEST_Updated Title",
            "subtitle": "New subtitle",
            "type": "banner",
            "content": "Updated content",
            "image": "",
            "images": [],
            "buttonText": "Click Here",
            "buttonLink": "",
            "backgroundColor": "#FFFFFF",
            "textColor": "#000000",
            "order": 1,
            "active": False
        }
        
        response = requests.put(f"{BASE_URL}/api/dynamic-sections/{section_id}", json=updated_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Updated Title"
        assert data["active"] == False
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/dynamic-sections/{section_id}")
        
        print(f"Dynamic section updated successfully")
    
    def test_delete_dynamic_section(self):
        """Test DELETE /api/dynamic-sections/{id} removes section"""
        # First create a section to delete
        create_response = requests.post(f"{BASE_URL}/api/dynamic-sections", json={
            "title": "TEST_To Be Deleted",
            "type": "text",
            "active": True
        })
        section_id = create_response.json()["id"]
        
        # Delete the section
        response = requests.delete(f"{BASE_URL}/api/dynamic-sections/{section_id}")
        
        assert response.status_code == 200
        
        # Verify it's deleted by trying to get all sections
        get_response = requests.get(f"{BASE_URL}/api/dynamic-sections")
        sections = get_response.json()
        section_ids = [s["id"] for s in sections]
        assert section_id not in section_ids, "Deleted section should not exist"
        
        print(f"Dynamic section deleted successfully")
    
    def test_dynamic_sections_in_content_response(self):
        """Test that active dynamic sections are included in /api/content"""
        # Create an active section
        create_response = requests.post(f"{BASE_URL}/api/dynamic-sections", json={
            "title": "TEST_Content Section",
            "type": "banner",
            "active": True
        })
        section_id = create_response.json()["id"]
        
        # Check it appears in content
        content_response = requests.get(f"{BASE_URL}/api/content")
        data = content_response.json()
        
        assert "dynamicSections" in data, "dynamicSections should be in content response"
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/dynamic-sections/{section_id}")
        
        print("Dynamic sections included in content response")


class TestHeroSection:
    """Tests for Hero section changes"""
    
    def test_hero_label_can_be_empty(self):
        """Test that hero label field can be empty (Flower Studio removed)"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        hero = response.json()["site"]["hero"]
        
        # Label should exist but can be empty
        assert "label" in hero, "Hero should have label field"
        
        # Since we removed Flower Studio, check label is empty or doesn't contain it
        label = hero.get("label", "")
        print(f"Hero label value: '{label}'")
        
        # The label might be empty string or something else, but shouldn't be "Flower Studio"
        # Based on the screenshot, the label was removed
    
    def test_hero_has_required_fields(self):
        """Test hero section has all required fields"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        hero = response.json()["site"]["hero"]
        
        required_fields = ['title', 'titleHighlight', 'subtitle', 'ctaText', 'ctaSecondaryText']
        for field in required_fields:
            assert field in hero, f"Hero missing required field: {field}"
        
        print(f"Hero title: '{hero['title']}'")
        print(f"Hero highlight: '{hero['titleHighlight']}'")


class TestServicesSection:
    """Tests for Services section carousel"""
    
    def test_services_section_config(self):
        """Test services section configuration in content"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        services = response.json()["site"]["services"]
        
        assert "title" in services
        assert "titleHighlight" in services
        assert "subtitle" in services
        
        print(f"Services section: '{services['title']} {services['titleHighlight']}'")
    
    def test_services_have_required_fields(self):
        """Test each service has fields needed for carousel display"""
        response = requests.get(f"{BASE_URL}/api/services")
        
        assert response.status_code == 200
        services = response.json()
        
        for service in services:
            assert "id" in service
            assert "title" in service
            assert "description" in service
            assert "image" in service
            
        print(f"All {len(services)} services have required fields for carousel")


class TestCleanup:
    """Cleanup test data created during tests"""
    
    def test_cleanup_test_sections(self):
        """Remove all TEST_ prefixed dynamic sections"""
        response = requests.get(f"{BASE_URL}/api/dynamic-sections")
        sections = response.json()
        
        deleted_count = 0
        for section in sections:
            if section.get("title", "").startswith("TEST_"):
                delete_response = requests.delete(f"{BASE_URL}/api/dynamic-sections/{section['id']}")
                if delete_response.status_code == 200:
                    deleted_count += 1
        
        print(f"Cleaned up {deleted_count} test sections")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
