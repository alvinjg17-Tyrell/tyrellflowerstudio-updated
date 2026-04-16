from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from PIL import Image

ROOT_DIR = Path(__file__).parent
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)
THUMBNAILS_DIR = UPLOADS_DIR / "thumbnails"
THUMBNAILS_DIR.mkdir(exist_ok=True)

MAX_IMAGE_SIZE = (1200, 1200)
THUMBNAIL_SIZE = (400, 400)
JPEG_QUALITY = 85

load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

SECRET_KEY = os.environ.get("SECRET_KEY", "tyrell-floreria-secret-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

ADMIN_EMAIL = "tyrellflowerstudio@gmail.com"
ADMIN_PASSWORD_HASH = pwd_context.hash("897355")

app = FastAPI()
app.mount("/api/uploads/thumbnails", StaticFiles(directory=str(THUMBNAILS_DIR)), name="thumbnails")
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
api_router = APIRouter(prefix="/api")


# ─── Auth Models ──────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email != ADMIN_EMAIL:
            raise HTTPException(status_code=401, detail="Token inválido")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


# ─── Models ───────────────────────────────────────────────

class Feature(BaseModel):
    title: str = ""
    description: str = ""
    icon: str = "Flower2"


class BrandContent(BaseModel):
    name: str = "TYRELL"
    tagline: str = ""
    description: str = ""
    catalogUrl: str = ""
    whatsappLink: str = ""
    location: str = ""
    locationUrl: str = ""
    whatsappNumber: str = ""


class HeroContent(BaseModel):
    label: str = "Flower Studio"
    title: str = ""
    titleHighlight: str = ""
    subtitle: str = ""
    ctaText: str = "Ver Catálogo"
    ctaSecondaryText: str = "Nuestros Servicios"
    image: str = ""
    video: str = ""
    useVideo: bool = False
    titleColor: str = "#FFFFFF"
    highlightColor: str = "#D4B896"
    subtitleColor: str = "#FFFFFF"
    ctaButtonColor: str = "#D8A7B1"
    ctaButtonTextColor: str = "#FFFFFF"
    ctaSecondaryTextColor: str = "#FFFFFF"


class HeaderContent(BaseModel):
    topBarLeft: str = ""
    topBarRight: str = ""
    ctaText: str = "Ver Catálogo"
    navItems: List[str] = []
    topBarBgColor: str = "#B76E79"
    topBarTextColor: str = "#FFFFFF"
    ctaButtonColor: str = "#D8A7B1"
    ctaTextColor: str = "#FFFFFF"


class AboutContent(BaseModel):
    label: str = "Conócenos"
    title: str = ""
    subtitle: str = ""
    description: str = ""
    badgeNumber: str = "+2000"
    badgeLabel: str = "Arreglos Entregados"
    features: List[Feature] = []
    image: str = ""


class ServicesContent(BaseModel):
    label: str = "Nuestros Servicios"
    title: str = "Creaciones para cada"
    titleHighlight: str = "momento"
    subtitle: str = "Descubre nuestra colección de arreglos florales y servicios diseñados para sorprender."


class ContactContent(BaseModel):
    title: str = ""
    subtitle: str = ""
    address: str = ""
    whatsappLabel: str = ""
    scheduleTitle: str = ""
    schedule: str = ""
    scheduleWeekend: str = ""
    showLocation: bool = True


class CatalogColors(BaseModel):
    labelColor: str = "#f4c952"
    titleColor: str = "#1a1a1a"
    highlightColor: str = "#f4c952"
    buttonBgColor: str = "#f4c952"
    buttonTextColor: str = "#FFFFFF"
    lineColor: str = "#f4c952"


class ContactColors(BaseModel):
    bgColor: str = "#4F6D5E"
    labelColor: str = "#f4c952"
    titleColor: str = "#FFFFFF"
    subtitleColor: str = "#FFFFFF99"
    buttonBgColor: str = "#f4c952"
    buttonTextColor: str = "#FFFFFF"
    inputBorderColor: str = "#f4c952"


class ColorPalette(BaseModel):
    primary: str = "#f4c952"
    primaryHover: str = "#e0b63e"
    secondary: str = "#B76E79"
    accent: str = "#D4B896"
    text: str = "#1a1a1a"
    textLight: str = "#4F6D5E"
    background: str = "#F5F1EB"
    backgroundAlt: str = "#FFFFFF"
    rose: str = "#D8A7B1"
    nude: str = "#E8C1B5"


class DynamicSectionCreate(BaseModel):
    title: str
    subtitle: str = ""
    type: str = "banner"
    content: str = ""
    image: str = ""
    images: List[str] = []
    buttonText: str = ""
    buttonLink: str = ""
    backgroundColor: str = ""
    textColor: str = ""
    order: int = 0
    active: bool = True


class DynamicSectionResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    type: str
    content: str
    image: str
    images: List[str]
    buttonText: str
    buttonLink: str
    backgroundColor: str
    textColor: str
    order: int
    active: bool
    created_at: datetime


class SectionOrderItem(BaseModel):
    id: str
    name: str
    visible: bool = True


class SectionOrder(BaseModel):
    sections: List[SectionOrderItem] = [
        SectionOrderItem(id="about", name="Nosotros", visible=True),
        SectionOrderItem(id="services", name="Productos", visible=True),
        SectionOrderItem(id="catalogs", name="Catálogos", visible=True),
        SectionOrderItem(id="contact", name="Contacto", visible=True),
    ]


class SiteContent(BaseModel):
    brand: BrandContent = BrandContent()
    header: Optional[HeaderContent] = HeaderContent()
    hero: HeroContent = HeroContent()
    about: AboutContent = AboutContent()
    services: ServicesContent = ServicesContent()
    contact: ContactContent = ContactContent()
    colorPalette: Optional[ColorPalette] = ColorPalette()
    catalogColors: Optional[CatalogColors] = CatalogColors()
    contactColors: Optional[ContactColors] = ContactColors()
    sectionOrder: Optional[SectionOrder] = SectionOrder()


class ServiceCreate(BaseModel):
    title: str
    description: str = ""
    image: str = ""
    images: List[str] = []
    tag: str = ""
    price: str = ""
    order: int = 0


class ServiceResponse(BaseModel):
    id: str
    title: str
    description: str
    image: str
    images: List[str] = []
    tag: str
    price: str


class ProductItem(BaseModel):
    id: str = ""
    name: str = ""
    slug: str = ""
    subtitle: str = ""
    description: str = ""
    image: str = ""
    images: List[str] = []
    video: str = ""
    imagePosition: dict = {}
    price: str = ""
    tag: str = ""
    buttonText: str = "PEDIR"
    buttonBgColor: str = "#e8d8b8"
    buttonTextColor: str = "#7a5a1f"
    order: int = 0
    active: bool = True


class CategoryCreate(BaseModel):
    name: str
    description: str = ""
    products: List[ProductItem] = []
    order: int = 0
    active: bool = True


class CategoryResponse(BaseModel):
    id: str
    name: str
    description: str
    products: List[ProductItem]
    order: int
    active: bool
    created_at: datetime


class CatalogLinkCreate(BaseModel):
    title: str
    url: str
    order: int = 0


class CatalogLinkResponse(BaseModel):
    id: str
    title: str
    url: str
    order: int
    created_at: datetime


# ─── Default seed data ────────────────────────────────────

DEFAULT_SITE = {
    "brand": {
        "name": "TYRELL",
        "tagline": "Donde cada pétalo cuenta una historia de amor",
        "description": "En TYRELL, transformamos flores frescas en obras de arte que transmiten emociones.",
        "catalogUrl": "https://heyzine.com/flip-book/9c9575825d.html#page/14",
        "whatsappLink": "https://wa.me/51910770284",
        "location": "Jirón Pedro Pascasio Noriega, Moyobamba, Perú",
        "locationUrl": "https://www.google.com/maps/search/Jir%C3%B3n+Pedro+Pascasio+Noriega,+Moyobamba,+Per%C3%BA/@-6.0289855,-76.9782139,15.93z?hl=es&entry=ttu&g_ep=EgoyMDI2MDIwOC4wIKXMDSoASAFQAw%3D%3D",
        "whatsappNumber": "+51 910 770 284",
    },
    "hero": {
        "label": "Flower Studio",
        "title": "Flores pɑrɑ quienes",
        "titleHighlight": "ɑmɑn lo extrɑordinɑrio.",
        "subtitle": "Arreglos florales exclusivos que expresan tus sentimientos más profundos. Calidad premium, creatividad sin límites y entrega puntual.",
        "ctaText": "Ver Catálogo",
        "ctaSecondaryText": "Nuestros Servicios",
        "image": "https://images.unsplash.com/photo-1706064955769-2e6208cb1671?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
        "video": "https://customer-assets.emergentagent.com/job_tyrell-floreria/artifacts/wbf3py5n_IMG_3174.MOV",
        "useVideo": True,
    },
    "about": {
        "label": "Conócenos",
        "title": "Nuestra Esencia",
        "subtitle": "Más que flores, creamos momentos",
        "description": "En TYRELL nos apasiona el arte floral. Cada arreglo es diseñado con esmero, seleccionando las flores más frescas y combinándolas con creatividad para crear piezas únicas que transmiten emociones genuinas.",
        "badgeNumber": "+2000",
        "badgeLabel": "Arreglos Entregados",
        "features": [
            {
                "title": "Flores Frescas",
                "description": "Seleccionamos las mejores flores cada día para garantizar frescura y durabilidad en cada arreglo.",
                "icon": "Flower2",
            },
            {
                "title": "Diseño Exclusivo",
                "description": "Cada creación es única, diseñada con pasión y atención al detalle para sorprender.",
                "icon": "Sparkles",
            },
            {
                "title": "Entrega Puntual",
                "description": "Tu pedido llegará en el momento perfecto, porque cada segundo cuenta cuando se trata de emociones.",
                "icon": "Clock",
            },
        ],
        "image": "https://images.unsplash.com/photo-1584515453937-c00929e621d1?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    },
    "services": {
        "label": "Nuestros Servicios",
        "title": "Creaciones para cada",
        "titleHighlight": "momento",
        "subtitle": "Descubre nuestra colección de arreglos florales y servicios diseñados para sorprender.",
    },
    "contact": {
        "title": "Contáctanos",
        "subtitle": "Estamos aquí para hacer realidad tu visión floral",
        "address": "Jirón Pedro Pascasio Noriega, Moyobamba, Perú",
        "whatsappLabel": "Escríbenos por WhatsApp",
        "scheduleTitle": "Horario de Atención",
        "schedule": "Lunes a Sábado: 8:00 AM - 7:00 PM",
        "scheduleWeekend": "Domingos: 9:00 AM - 2:00 PM",
    },
}

DEFAULT_SERVICES = [
    {
        "id": str(uuid.uuid4()),
        "title": "Arreglos Florales",
        "description": "Composiciones artísticas con las flores más selectas, perfectas para decorar cualquier espacio con elegancia y distinción.",
        "image": "https://images.unsplash.com/photo-1487530811176-3780de880c2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "tag": "Popular",
        "price": "",
        "order": 0,
        "created_at": datetime.utcnow(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Ramos Personalizados",
        "description": "Diseñamos ramos a tu medida, eligiendo colores, flores y estilos que reflejen tu mensaje personal.",
        "image": "https://images.unsplash.com/photo-1705807088510-02da367dcda8?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "tag": "Exclusivo",
        "price": "",
        "order": 1,
        "created_at": datetime.utcnow(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Regalos Especiales",
        "description": "Complementa tus flores con detalles únicos: chocolates, peluches y accesorios para crear el regalo perfecto.",
        "image": "https://images.unsplash.com/photo-1618239265038-9e4c865fbd10?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "tag": "Nuevo",
        "price": "",
        "order": 2,
        "created_at": datetime.utcnow(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Eventos & Bodas",
        "description": "Decoración floral completa para bodas, quinceañeros, aniversarios y todo tipo de celebraciones especiales.",
        "image": "https://images.unsplash.com/photo-1551468220-0a25172193f9?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "tag": "Premium",
        "price": "",
        "order": 3,
        "created_at": datetime.utcnow(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Tulipanes Elegantes",
        "description": "Hermosos arreglos con tulipanes importados, símbolo de amor perfecto y elegancia atemporal.",
        "image": "https://images.unsplash.com/photo-1613386080939-170e1e833f70?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
        "tag": "Temporada",
        "price": "",
        "order": 4,
        "created_at": datetime.utcnow(),
    },
]

DEFAULT_CATALOG_LINKS = [
    {
        "id": str(uuid.uuid4()),
        "title": "Catálogo Principal",
        "url": "https://heyzine.com/flip-book/9c9575825d.html#page/14",
        "order": 0,
        "created_at": datetime.utcnow(),
    },
]


# ─── Helpers ──────────────────────────────────────────────

def optimize_image(input_path: Path, output_path: Path, max_size: tuple, quality: int = 85):
    try:
        with Image.open(input_path) as img:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            img.save(output_path, "JPEG", quality=quality, optimize=True)
            return True
    except Exception as e:
        logger.error(f"Error optimizing image: {e}")
        return False


def slugify(value: str) -> str:
    value = (value or "").strip().lower()
    allowed = []
    for char in value:
        if char.isalnum():
            allowed.append(char)
        elif char in [" ", "-", "_"]:
            allowed.append("-")
    slug = "".join(allowed)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


def normalize_product(product: dict, index: int = 0) -> dict:
    normalized = {
        "id": product.get("id") or str(uuid.uuid4()),
        "name": product.get("name", ""),
        "slug": product.get("slug", ""),
        "subtitle": product.get("subtitle", ""),
        "description": product.get("description", ""),
        "image": product.get("image", ""),
        "images": product.get("images", []) or [],
        "video": product.get("video", ""),
        "imagePosition": product.get("imagePosition", {}) or {"x": 50, "y": 50},
        "price": product.get("price", ""),
        "tag": product.get("tag", ""),
        "buttonText": product.get("buttonText", "PEDIR"),
        "buttonBgColor": product.get("buttonBgColor", "#e8d8b8"),
        "buttonTextColor": product.get("buttonTextColor", "#7a5a1f"),
        "order": product.get("order", index),
        "active": product.get("active", True),
    }

    if not normalized["slug"]:
        normalized["slug"] = slugify(normalized["name"])

    return normalized


async def seed_data():
    existing = await db.site_content.find_one()
    if not existing:
        await db.site_content.insert_one(DEFAULT_SITE)
        logger.info("Seeded site_content")
    else:
        update_fields = {}
        if "services" not in existing:
            update_fields["services"] = DEFAULT_SITE["services"]
        if "locationUrl" not in existing.get("brand", {}):
            update_fields["brand.locationUrl"] = DEFAULT_SITE["brand"]["locationUrl"]
        if "label" not in existing.get("hero", {}):
            update_fields["hero.label"] = DEFAULT_SITE["hero"]["label"]
        if "label" not in existing.get("about", {}):
            update_fields["about.label"] = DEFAULT_SITE["about"]["label"]
            update_fields["about.badgeNumber"] = DEFAULT_SITE["about"]["badgeNumber"]
            update_fields["about.badgeLabel"] = DEFAULT_SITE["about"]["badgeLabel"]
        if update_fields:
            await db.site_content.update_one({}, {"$set": update_fields})
            logger.info("Updated site_content with new fields")

    svc_count = await db.services.count_documents({})
    if svc_count == 0:
        await db.services.insert_many(DEFAULT_SERVICES)
        logger.info("Seeded services")

    cat_count = await db.catalog_links.count_documents({})
    if cat_count == 0:
        await db.catalog_links.insert_many(DEFAULT_CATALOG_LINKS)
        logger.info("Seeded catalog_links")


# ─── Routes ───────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "TYRELL API running"}


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    if request.email != ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    if not pwd_context.verify(request.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    access_token = create_access_token(data={"sub": request.email})
    return TokenResponse(access_token=access_token)


@api_router.get("/auth/verify")
async def verify_auth(email: str = Depends(verify_token)):
    return {"valid": True, "email": email}


@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov", ".webm"]:
        raise HTTPException(status_code=400, detail="Formato no soportado")

    file_id = uuid.uuid4().hex
    original_filename = f"{file_id}_original{ext}"
    original_path = UPLOADS_DIR / original_filename

    with open(original_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    if ext in [".jpg", ".jpeg", ".png", ".webp"]:
        optimized_filename = f"{file_id}.jpg"
        optimized_path = UPLOADS_DIR / optimized_filename

        thumbnail_filename = f"{file_id}_thumb.jpg"
        thumbnail_path = THUMBNAILS_DIR / thumbnail_filename

        optimize_image(original_path, optimized_path, MAX_IMAGE_SIZE, JPEG_QUALITY)
        optimize_image(original_path, thumbnail_path, THUMBNAIL_SIZE, 75)

        if optimized_path.exists():
            original_path.unlink(missing_ok=True)
            return {
                "url": f"/api/uploads/{optimized_filename}",
                "thumbnail": f"/api/uploads/thumbnails/{thumbnail_filename}",
                "filename": optimized_filename,
            }

    return {"url": f"/api/uploads/{original_filename}", "filename": original_filename}


@api_router.get("/content")
async def get_all_content():
    site = await db.site_content.find_one()
    if site:
        site.pop("_id", None)
        if "colorPalette" not in site:
            site["colorPalette"] = ColorPalette().dict()
    else:
        site = DEFAULT_SITE
        site["colorPalette"] = ColorPalette().dict()

    services = []
    async for svc in db.services.find().sort("order", 1):
        svc.pop("_id", None)
        services.append(svc)

    catalog_links = []
    async for cl in db.catalog_links.find().sort("order", 1):
        cl.pop("_id", None)
        catalog_links.append(cl)

    dynamic_sections = []
    async for sec in db.dynamic_sections.find({"active": True}).sort("order", 1):
        sec.pop("_id", None)
        dynamic_sections.append(sec)

    categories = []
    async for cat in db.product_categories.find({"active": True}).sort("order", 1):
        cat.pop("_id", None)
        cat["products"] = [
            normalize_product(product, index)
            for index, product in enumerate(cat.get("products", []))
            if product.get("active", True)
        ]
        categories.append(cat)

    return {
        "site": site,
        "services": services,
        "catalogLinks": catalog_links,
        "dynamicSections": dynamic_sections,
        "categories": categories,
    }


@api_router.put("/content")
async def update_site_content(content: SiteContent):
    content_dict = content.dict()
    await db.site_content.update_one({}, {"$set": content_dict}, upsert=True)
    return {"message": "Contenido actualizado", "data": content_dict}


@api_router.get("/services", response_model=List[ServiceResponse])
async def get_services():
    services = []
    async for svc in db.services.find().sort("order", 1):
        svc.pop("_id", None)
        services.append(ServiceResponse(**svc))
    return services


@api_router.post("/services", response_model=ServiceResponse)
async def create_service(service: ServiceCreate):
    svc_dict = service.dict()
    svc_dict["id"] = str(uuid.uuid4())
    svc_dict["created_at"] = datetime.utcnow()
    await db.services.insert_one(svc_dict)
    return ServiceResponse(**svc_dict)


@api_router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: str, service: ServiceCreate):
    result = await db.services.find_one({"id": service_id})
    if not result:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    await db.services.update_one({"id": service_id}, {"$set": service.dict()})
    updated = await db.services.find_one({"id": service_id})
    updated.pop("_id", None)
    return ServiceResponse(**updated)


@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return {"message": "Servicio eliminado"}


@api_router.get("/categories")
async def get_categories():
    categories = []
    async for cat in db.product_categories.find().sort("order", 1):
        cat.pop("_id", None)
        cat["products"] = [
            normalize_product(product, index)
            for index, product in enumerate(cat.get("products", []))
        ]
        categories.append(cat)
    return categories


@api_router.get("/products/{slug}")
async def get_product_by_slug(slug: str):
    async for cat in db.product_categories.find({"active": True}).sort("order", 1):
        cat.pop("_id", None)
        for index, product in enumerate(cat.get("products", [])):
            normalized = normalize_product(product, index)
            if normalized.get("slug") == slug and normalized.get("active", True):
                return {
                    "product": normalized,
                    "category": {
                        "id": cat.get("id"),
                        "name": cat.get("name"),
                        "description": cat.get("description", ""),
                    },
                }

    raise HTTPException(status_code=404, detail="Producto no encontrado")


@api_router.post("/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate):
    cat_dict = category.dict()
    cat_dict["id"] = str(uuid.uuid4())
    cat_dict["created_at"] = datetime.utcnow()
    cat_dict["products"] = [
        normalize_product(product, index)
        for index, product in enumerate(cat_dict.get("products", []))
    ]
    await db.product_categories.insert_one(cat_dict)
    return CategoryResponse(**cat_dict)


@api_router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, category: CategoryCreate):
    result = await db.product_categories.find_one({"id": category_id})
    if not result:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    cat_dict = category.dict()
    cat_dict["products"] = [
        normalize_product(product, index)
        for index, product in enumerate(cat_dict.get("products", []))
    ]

    await db.product_categories.update_one({"id": category_id}, {"$set": cat_dict})
    updated = await db.product_categories.find_one({"id": category_id})
    updated.pop("_id", None)
    updated["products"] = [
        normalize_product(product, index)
        for index, product in enumerate(updated.get("products", []))
    ]
    return CategoryResponse(**updated)


@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    result = await db.product_categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"message": "Categoría eliminada"}


@api_router.get("/catalog-links", response_model=List[CatalogLinkResponse])
async def get_catalog_links():
    links = []
    async for cl in db.catalog_links.find().sort("order", 1):
        cl.pop("_id", None)
        links.append(CatalogLinkResponse(**cl))
    return links


@api_router.post("/catalog-links", response_model=CatalogLinkResponse)
async def create_catalog_link(link: CatalogLinkCreate):
    link_dict = link.dict()
    link_dict["id"] = str(uuid.uuid4())
    link_dict["created_at"] = datetime.utcnow()
    await db.catalog_links.insert_one(link_dict)
    return CatalogLinkResponse(**link_dict)


@api_router.put("/catalog-links/{link_id}", response_model=CatalogLinkResponse)
async def update_catalog_link(link_id: str, link: CatalogLinkCreate):
    result = await db.catalog_links.find_one({"id": link_id})
    if not result:
        raise HTTPException(status_code=404, detail="Enlace no encontrado")
    await db.catalog_links.update_one({"id": link_id}, {"$set": link.dict()})
    updated = await db.catalog_links.find_one({"id": link_id})
    updated.pop("_id", None)
    return CatalogLinkResponse(**updated)


@api_router.delete("/catalog-links/{link_id}")
async def delete_catalog_link(link_id: str):
    result = await db.catalog_links.delete_one({"id": link_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enlace no encontrado")
    return {"message": "Enlace eliminado"}


@api_router.get("/color-palette")
async def get_color_palette():
    site = await db.site_content.find_one()
    if site and "colorPalette" in site:
        return site["colorPalette"]
    return ColorPalette().dict()


@api_router.put("/color-palette")
async def update_color_palette(palette: ColorPalette):
    await db.site_content.update_one({}, {"$set": {"colorPalette": palette.dict()}}, upsert=True)
    return {"message": "Paleta de colores actualizada", "data": palette.dict()}


@api_router.get("/dynamic-sections")
async def get_dynamic_sections():
    sections = []
    async for sec in db.dynamic_sections.find().sort("order", 1):
        sec.pop("_id", None)
        sections.append(sec)
    return sections


@api_router.post("/dynamic-sections", response_model=DynamicSectionResponse)
async def create_dynamic_section(section: DynamicSectionCreate):
    sec_dict = section.dict()
    sec_dict["id"] = str(uuid.uuid4())
    sec_dict["created_at"] = datetime.utcnow()
    await db.dynamic_sections.insert_one(sec_dict)
    return DynamicSectionResponse(**sec_dict)


@api_router.put("/dynamic-sections/{section_id}", response_model=DynamicSectionResponse)
async def update_dynamic_section(section_id: str, section: DynamicSectionCreate):
    result = await db.dynamic_sections.find_one({"id": section_id})
    if not result:
        raise HTTPException(status_code=404, detail="Sección no encontrada")
    await db.dynamic_sections.update_one({"id": section_id}, {"$set": section.dict()})
    updated = await db.dynamic_sections.find_one({"id": section_id})
    updated.pop("_id", None)
    return DynamicSectionResponse(**updated)


@api_router.delete("/dynamic-sections/{section_id}")
async def delete_dynamic_section(section_id: str):
    result = await db.dynamic_sections.delete_one({"id": section_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sección no encontrada")
    return {"message": "Sección eliminada"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    await seed_data()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()