# TYRELL - API Contracts

## Architecture
- Backend: FastAPI + MongoDB (motor)
- Frontend: React fetches all content from API
- Admin panel at /admin route for editing everything

## MongoDB Collections

### `site_content` (single document)
```json
{
  "brand": { "name", "tagline", "description", "catalogUrl", "whatsappLink", "location", "whatsappNumber" },
  "hero": { "title", "titleHighlight", "subtitle", "ctaText", "image" },
  "about": { "title", "subtitle", "description", "features": [{ "title", "description", "icon" }], "image" },
  "contact": { "title", "subtitle", "address", "whatsappLabel", "scheduleTitle", "schedule", "scheduleWeekend" }
}
```

### `services` (multiple documents)
```json
{ "id", "title", "description", "image", "tag", "price", "order", "created_at" }
```

### `testimonials` (multiple documents)
```json
{ "id", "name", "text", "rating", "created_at" }
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/content | Get all site content + services + testimonials |
| PUT | /api/content | Update site content (brand, hero, about, contact) |
| GET | /api/services | List all services |
| POST | /api/services | Create service |
| PUT | /api/services/{id} | Update service |
| DELETE | /api/services/{id} | Delete service |
| GET | /api/testimonials | List all testimonials |
| POST | /api/testimonials | Create testimonial |
| PUT | /api/testimonials/{id} | Update testimonial |
| DELETE | /api/testimonials/{id} | Delete testimonial |

## Frontend Integration
- LandingPage fetches GET /api/content on mount
- Admin panel uses all CRUD endpoints
- Remove mock.js dependency after integration
- Admin route: /admin (no auth for simplicity)
