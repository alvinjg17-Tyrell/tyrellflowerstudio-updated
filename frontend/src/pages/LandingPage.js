import { useState, useEffect } from "react";
import { Header } from "../components/landing/Header";
import { HeroSection } from "../components/landing/HeroSection";
import { AboutSection } from "../components/landing/AboutSection";
import ServicesSection from "../components/landing/ServicesSection";
import { CatalogLinksSection } from "../components/landing/CatalogLinksSection";
import { ContactSection } from "../components/landing/ContactSection";
import { Footer } from "../components/landing/Footer";
import { WhatsAppButton } from "../components/landing/WhatsAppButton";
import { DynamicSection } from "../components/landing/DynamicSection";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "../lib/api";

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getContent();

        const palette = result?.site?.colorPalette;
        if (palette) {
          document.documentElement.style.setProperty("--color-primary", palette.primary || "#f4c952");
          document.documentElement.style.setProperty("--color-primary-hover", palette.primaryHover || "#e0b63e");
          document.documentElement.style.setProperty("--color-secondary", palette.secondary || "#B76E79");
          document.documentElement.style.setProperty("--color-accent", palette.accent || "#D4B896");
          document.documentElement.style.setProperty("--color-text", palette.text || "#1a1a1a");
          document.documentElement.style.setProperty("--color-text-light", palette.textLight || "#4F6D5E");
          document.documentElement.style.setProperty("--color-background", palette.background || "#F5F1EB");
        }

        setData(result);
      } catch (error) {
        console.error("Error cargando contenido:", error);
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

  if (!data || !data.site) {
    return (
      <div className="min-h-screen bg-tyrell-ivory flex items-center justify-center">
        <p className="text-tyrell-olive/50">Error cargando contenido</p>
      </div>
    );
  }

  const colorPalette = data.site.colorPalette || {
    primary: "#f4c952",
    primaryHover: "#e0b63e",
    secondary: "#B76E79",
    accent: "#D4B896",
    text: "#1a1a1a",
    textLight: "#4F6D5E",
    background: "#F5F1EB",
  };

  const sectionOrder = data.site.sectionOrder?.sections || [
    { id: "about", name: "Nosotros", visible: true },
    { id: "services", name: "Productos", visible: true },
    { id: "catalogs", name: "Catálogos", visible: true },
    { id: "contact", name: "Contacto", visible: true },
  ];

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "about":
        return <AboutSection key="about" siteData={data.site} colorPalette={colorPalette} />;

      case "services":
        return (
          <ServicesSection
            key="services"
            services={data.services || []}
            siteData={data.site}
            colorPalette={colorPalette}
            categories={data.categories || []}
          />
        );

      case "catalogs":
        return data.catalogLinks && data.catalogLinks.length > 0 ? (
          <CatalogLinksSection
            key="catalogs"
            catalogLinks={data.catalogLinks}
            siteData={data.site}
            colorPalette={colorPalette}
          />
        ) : null;

      case "contact":
        return <ContactSection key="contact" siteData={data.site} colorPalette={colorPalette} />;

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

      {data.dynamicSections &&
        data.dynamicSections.length > 0 &&
        data.dynamicSections.map((section) => (
          <DynamicSection key={section.id} section={section} />
        ))}

      <Footer siteData={data.site} colorPalette={colorPalette} />
      <WhatsAppButton whatsappLink={data.site?.brand?.whatsappLink} />
    </div>
  );
}