import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "../components/landing/Header";
import { ContactSection } from "../components/landing/ContactSection";
import { Footer } from "../components/landing/Footer";
import { WhatsAppButton } from "../components/landing/WhatsAppButton";
import { api } from "../lib/api";

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
  },
};

export default function ContactPage() {
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
          },
        };

        const palette = finalData.site.colorPalette;
        document.documentElement.style.setProperty("--color-primary", palette.primary || "#f4c952");
        document.documentElement.style.setProperty("--color-primary-hover", palette.primaryHover || "#e0b63e");
        document.documentElement.style.setProperty("--color-secondary", palette.secondary || "#B76E79");
        document.documentElement.style.setProperty("--color-accent", palette.accent || "#D4B896");
        document.documentElement.style.setProperty("--color-text", palette.text || "#1a1a1a");
        document.documentElement.style.setProperty("--color-text-light", palette.textLight || "#4F6D5E");
        document.documentElement.style.setProperty("--color-background", palette.background || "#F5F1EB");

        setData(finalData);
      } catch (error) {
        console.error("Error cargando ContactPage:", error);
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

  const colorPalette = data.site?.colorPalette || fallbackData.site.colorPalette;

  return (
    <div className="min-h-screen bg-white">
      <Header siteData={data.site} colorPalette={colorPalette} />

      <main>
        <section className="px-4 md:px-8 lg:px-10 py-12 md:py-16 bg-white border-b border-black/5">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#9a9a9a] mb-3">
              Contacto
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-[#111]">
              Hablemos
            </h1>
          </div>
        </section>

        <ContactSection
          siteData={data.site}
          colorPalette={colorPalette}
        />
      </main>

      <Footer siteData={data.site} colorPalette={colorPalette} />
      <WhatsAppButton whatsappLink={data.site?.brand?.whatsappLink} />
    </div>
  );
}