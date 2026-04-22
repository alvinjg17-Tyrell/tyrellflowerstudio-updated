import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Header } from "../components/landing/Header";
import { HeroSection } from "../components/landing/HeroSection";
import { AboutSection } from "../components/landing/AboutSection";
import { CatalogLinksSection } from "../components/landing/CatalogLinksSection";
import { ContactSection } from "../components/landing/ContactSection";
import { Footer } from "../components/landing/Footer";
import { WhatsAppButton } from "../components/landing/WhatsAppButton";
import { DynamicSection } from "../components/landing/DynamicSection";
import { Toaster } from "sonner";
import { api } from "../lib/api";

const BACKEND_URL = "https://tyrellflowerstudio-updated-production.up.railway.app";

const fallbackData = {
  site: {
    brand: {
      name: "TYRELL",
      whatsappLink: "https://wa.me/51910770284",
      catalogUrl: "",
    },
    colorPalette: {
      primary: "#f4c952",
      primaryHover: "#e0b63e",
      secondary: "#B76E79",
      accent: "#D4B896",
      text: "#1a1a1a",
      textLight: "#4F6D5E",
      background: "#F5F1EB",
      backgroundAlt: "#FFFFFF",
      rose: "#D8A7B1",
      nude: "#E8C1B5",
    },
    sectionOrder: {
      sections: [
        { id: "about", name: "Nosotros", visible: true },
        { id: "services", name: "Productos", visible: true },
        { id: "catalogs", name: "Catálogos", visible: true },
        { id: "contact", name: "Contacto", visible: true },
      ],
    },
  },
  categories: [],
  catalogLinks: [],
  dynamicSections: [],
};

const slugify = (text = "") =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fixImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
  return `${BACKEND_URL}/${url}`;
};

const ProductCard = ({ product }) => {
  const slug = product.slug || slugify(product.name || "");

  return (
    <Link to={`/products/${slug}`} className="text-left group block">
      <div className="aspect-[4/5] overflow-hidden bg-[#f7f4ef]">
        <img
          src={fixImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <h3 className="mt-3 text-[28px] font-serif leading-none text-[#111]">
        {product.name}
      </h3>

      {product.price && (
        <p className="mt-2 text-sm text-[#666]">{product.price}</p>
      )}
    </Link>
  );
};

const FeaturedProductsSection = ({ categories = [] }) => {
  const featuredProducts = useMemo(() => {
    const all = (categories || [])
      .filter((category) => category.active !== false)
      .flatMap((category) =>
        (category.products || []).filter((product) => product.active !== false)
      );

    return all.slice(0, 4);
  }, [categories]);

  if (!featuredProducts.length) return null;

  return (
    <section id="services" className="px-4 md:px-8 lg:px-10 py-14 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#9a9a9a] mb-3">
              Productos destacados
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#111]">
              Florería
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 text-sm uppercase tracking-[0.18em] bg-[#e8d8b8] text-[#7a5a1f] hover:opacity-90 transition-opacity"
          >
            Ver más
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getContent();

        const finalData = {
          ...fallbackData,
          ...result,
          site: {
            ...fallbackData.site,
            ...(result?.site || {}),
            brand: {
              ...fallbackData.site.brand,
              ...(result?.site?.brand || {}),
            },
            colorPalette: {
              ...fallbackData.site.colorPalette,
              ...(result?.site?.colorPalette || {}),
            },
            sectionOrder:
              result?.site?.sectionOrder || fallbackData.site.sectionOrder,
          },
          categories: result?.categories || [],
          catalogLinks: result?.catalogLinks || [],
          dynamicSections: result?.dynamicSections || [],
        };

        const palette = finalData.site.colorPalette;
        document.documentElement.style.setProperty(
          "--color-primary",
          palette.primary || "#f4c952"
        );
        document.documentElement.style.setProperty(
          "--color-primary-hover",
          palette.primaryHover || "#e0b63e"
        );
        document.documentElement.style.setProperty(
          "--color-secondary",
          palette.secondary || "#B76E79"
        );
        document.documentElement.style.setProperty(
          "--color-accent",
          palette.accent || "#D4B896"
        );
        document.documentElement.style.setProperty(
          "--color-text",
          palette.text || "#1a1a1a"
        );
        document.documentElement.style.setProperty(
          "--color-text-light",
          palette.textLight || "#4F6D5E"
        );
        document.documentElement.style.setProperty(
          "--color-background",
          palette.background || "#F5F1EB"
        );

        setData(finalData);
      } catch (error) {
        console.error("Error cargando contenido:", error);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-tyrell-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tyrell-gold animate-spin" />
      </div>
    );
  }

  const colorPalette =
    data.site?.colorPalette || fallbackData.site.colorPalette;
  const sectionOrder =
    data.site?.sectionOrder?.sections || fallbackData.site.sectionOrder.sections;

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "about":
        return (
          <AboutSection
            key="about"
            siteData={data.site}
            colorPalette={colorPalette}
          />
        );

      case "services":
        return (
          <FeaturedProductsSection
            key="services"
            categories={data.categories}
          />
        );

      case "catalogs":
        return data.catalogLinks?.length ? (
          <CatalogLinksSection
            key="catalogs"
            catalogLinks={data.catalogLinks}
            siteData={data.site}
            colorPalette={colorPalette}
          />
        ) : null;

      case "contact":
        return (
          <ContactSection
            key="contact"
            siteData={data.site}
            colorPalette={colorPalette}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" richColors />

      <Header siteData={data.site} colorPalette={colorPalette} />
      <HeroSection siteData={data.site} colorPalette={colorPalette} />

      {sectionOrder
        .filter((section) => section.visible)
        .map((section) => renderSection(section.id))}

      {data.dynamicSections
        ?.filter((section) => section.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((section) => (
          <DynamicSection key={section.id} section={section} />
        ))}

      <Footer siteData={data.site} colorPalette={colorPalette} />
      <WhatsAppButton whatsappLink={data.site?.brand?.whatsappLink} />
    </div>
  );
}