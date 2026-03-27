"""
Backend API Tests for TYRELL Flower Studio - Iteration 4
Testing: Image upload optimization, Services API, WhatsApp integration features
"""
import pytest
import requests
import os
import tempfile
from PIL import Image
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials for testing
ADMIN_EMAIL = "tyrellflowerstudio@gmail.com"
ADMIN_PASSWORD = "897355"


class TestImageUploadOptimization:
    """Tests for image upload with optimization and thumbnail generation"""
    
    def test_upload_image_returns_optimized_url_and_thumbnail(self):
        """Test that uploading an image returns both optimized URL and thumbnail URL"""
        # Create a test image in memory
        img = Image.new('RGB', (2000, 2000), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        # Upload the image
        files = {'file': ('test_image.jpg', img_bytes, 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response has required fields
        assert "url" in data, "Response should contain 'url'"
        assert "thumbnail" in data, "Response should contain 'thumbnail'"
        assert "filename" in data, "Response should contain 'filename'"
        
        # Verify URL formats
        assert data["url"].startswith("/api/uploads/"), f"URL should start with /api/uploads/, got: {data['url']}"
        assert data["thumbnail"].startswith("/api/uploads/thumbnails/"), f"Thumbnail should start with /api/uploads/thumbnails/, got: {data['thumbnail']}"
        
        # Verify optimized image is accessible
        image_response = requests.get(f"{BASE_URL}{data['url']}")
        assert image_response.status_code == 200, f"Optimized image should be accessible at {data['url']}"
        
        # Verify thumbnail is accessible
        thumb_response = requests.get(f"{BASE_URL}{data['thumbnail']}")
        assert thumb_response.status_code == 200, f"Thumbnail should be accessible at {data['thumbnail']}"
        
        print(f"Image uploaded successfully:")
        print(f"  - Optimized URL: {data['url']}")
        print(f"  - Thumbnail URL: {data['thumbnail']}")
    
    def test_upload_png_image_converts_to_jpg(self):
        """Test that uploading PNG creates optimized JPG version"""
        # Create a PNG image with transparency
        img = Image.new('RGBA', (1500, 1500), color=(255, 0, 0, 128))
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {'file': ('test_image.png', img_bytes, 'image/png')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200
        data = response.json()
        
        # Optimized should be JPG
        assert data["url"].endswith(".jpg"), f"Optimized image should be JPG, got: {data['url']}"
        assert data["thumbnail"].endswith("_thumb.jpg"), f"Thumbnail should be JPG, got: {data['thumbnail']}"
        
        print(f"PNG uploaded and converted to JPG successfully")
    
    def test_upload_video_does_not_create_thumbnail(self):
        """Test that video uploads don't create thumbnails"""
        # Create minimal MP4 file (just for API testing)
        video_bytes = io.BytesIO(b'\x00\x00\x00\x1c\x66\x74\x79\x70\x6d\x70\x34\x32')
        
        files = {'file': ('test_video.mp4', video_bytes, 'video/mp4')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200
        data = response.json()
        
        # Videos should have URL but no thumbnail
        assert "url" in data
        assert "thumbnail" not in data, "Videos should not have thumbnails"
        
        print(f"Video uploaded successfully without thumbnail: {data['url']}")
    
    def test_upload_unsupported_format_rejected(self):
        """Test that unsupported file formats are rejected"""
        txt_bytes = io.BytesIO(b'This is a text file')
        
        files = {'file': ('test.txt', txt_bytes, 'text/plain')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data or "message" in data
        print(f"Unsupported format correctly rejected")


class TestServicesWithImages:
    """Tests for Services API with images array"""
    
    def test_get_services_has_images_array(self):
        """Test that services include images array for grid display"""
        response = requests.get(f"{BASE_URL}/api/services")
        
        assert response.status_code == 200
        services = response.json()
        
        # Check each service has required fields
        for service in services:
            assert "id" in service
            assert "title" in service
            assert "description" in service
            assert "image" in service
            assert "images" in service, f"Service {service['title']} should have 'images' array"
            assert isinstance(service["images"], list), f"'images' should be a list"
            
            print(f"Service '{service['title']}' has {len(service['images'])} additional images")


class TestContentAPI:
    """Tests for content API"""
    
    def test_get_content_has_hero_highlight_settings(self):
        """Test that content includes hero section with highlight settings"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check hero section
        hero = data["site"]["hero"]
        assert "title" in hero
        assert "titleHighlight" in hero
        assert "subtitle" in hero
        
        print(f"Hero content: title='{hero.get('title')}', highlight='{hero.get('titleHighlight')}'")
    
    def test_get_content_has_brand_whatsapp_link(self):
        """Test that content includes WhatsApp link in brand"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        data = response.json()
        
        brand = data["site"]["brand"]
        assert "whatsappLink" in brand
        assert brand["whatsappLink"].startswith("https://wa.me/"), \
            f"WhatsApp link should start with https://wa.me/, got: {brand['whatsappLink']}"
        
        print(f"WhatsApp link: {brand['whatsappLink']}")


class TestWhatsAppIntegration:
    """Tests for WhatsApp button integration"""
    
    def test_whatsapp_number_in_content(self):
        """Verify WhatsApp number is properly configured"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        data = response.json()
        
        whatsapp_link = data["site"]["brand"]["whatsappLink"]
        # Extract number from link
        number = whatsapp_link.replace("https://wa.me/", "")
        
        assert len(number) > 0, "WhatsApp number should not be empty"
        assert number.isdigit() or number.startswith("+"), f"WhatsApp number format invalid: {number}"
        
        print(f"WhatsApp number configured: {number}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
