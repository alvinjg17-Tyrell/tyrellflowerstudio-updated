import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "../components/landing/Header";
import { AboutSection } from "../components/landing/AboutSection";
import { Footer } from "../components/landing/Footer";
import { WhatsAppButton } from "../components/landing/WhatsAppButton";
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
    about: {
      blocks: [],
    },
  },
};

const fixImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
  return `${BACKEND_URL}/${url}`;
};

const AboutBlocksSection = ({ blocks = [] }) => {
  const visibleBlocks = useMemo(() => {
    return (blocks || [])
      .filter((block) => block.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [blocks]);

  if (!visibleBlocks.length) return null;

  return (
    <>
      {visibleBlocks.map((block) => {
        const backgroundColor = block.backgroundColor || "#FFFFFF";
        const textColor = block.textColor || "#1a1a1a";

        if (block.type === "text") {
          return (
            <section
              key={block.id}
              className="px-4 md:px-8 lg:px-10 py-16"
              style={{ backgroundColor, color: textColor }}
            >
              <div className="max-w-4xl mx-auto text-center">
                {block.subtitle && (
                  <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] opacity-70 mb-3">
                    {block.subtitle}
                  </p>
                )}
                {block.title && (
                  <h2 className="text-4xl md:text-5xl font-serif mb-6">
                    {block.title}
                  </h2>
                )}
                {block.content && (
                  <p className="text-base md:text-lg leading-8 opacity-80 whitespace-pre-line">
                    {block.content}
                  </p>
                )}
              </div>
            </section>
          );
        }

        if (block.type === "image_text") {
          return (
            <section
              key={block.id}
              className="px-4 md:px-8 lg:px-10 py-16"
              style={{ backgroundColor, color: textColor }}
            >
              <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  {block.subtitle && (
                    <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] opacity-70 mb-3">
                      {block.subtitle}
                    </p>
                  )}
                  {block.title && (
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">
                      {block.title}
                    </h2>
                  )}
                  {block.content && (
                    <p className="text-base md:text-lg leading-8 opacity-80 whitespace-pre-line">
                      {block.content}
                    </p>
                  )}
                </div>

                <div>
                  {block.image && (
                    <img
                      src={fixImageUrl(block.image)}
                      alt={block.title || "Bloque"}
                      className="w-full h-auto object-cover"
                    />
                  )}
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "gallery") {
          const galleryImages = [block.image].filter(Boolean);

          return (
            <section
              key={block.id}
              className="px-4 md:px-8 lg:px-10 py-16"
              style={{ backgroundColor, color: textColor }}
            >
              <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-10">
                  {block.subtitle && (
                    <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] opacity-70 mb-3">
                      {block.subtitle}
                    </p>
                  )}
                  {block.title && (
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">
                      {block.title}
                    </h2>
                  )}
                  {block.content && (
                    <p className="text-base md:text-lg opacity-80 whitespace-pre-line max-w-3xl mx-auto">
                      {block.content}
                    </p>
                  )}
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image, index) => (
                      <div key={`${image}-${index}`} className="overflow-hidden">
                        <img
                          src={fixImageUrl(image)}
                          alt={`${block.title || "Galería"} ${index + 1}`}
                          className="w-full h-[420px] object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (block.type === "video") {
          return (
            <section
              key={block.id}
              className="px-4 md:px-8 lg:px-10 py-16"
              style={{ backgroundColor, color: textColor }}
            >
              <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-8">
                  {block.subtitle && (
                    <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] opacity-70 mb-3">
                      {block.subtitle}
                    </p>
                  )}
                  {block.title && (
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">
                      {block.title}
                    </h2>
                  )}
                  {block.content && (
                    <p className="text-base md:text-lg opacity-80 whitespace-pre-line max-w-3xl mx-auto">
                      {block.content}
                    </p>
                  )}
                </div>

                {block.video && (
                  <div className="aspect-video overflow-hidden bg-black">
                    <video
                      src={block.video}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (block.type === "cta") {
          return (
            <section
              key={block.id}
              className="px-4 md:px-8 lg:px-10 py-16"
              style={{ backgroundColor, color: textColor }}
            >
              <div className="max-w-4xl mx-auto text-center">
                {block.subtitle && (
                  <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] opacity-70 mb-3">
                    {block.subtitle}
                  </p>
                )}
                {block.title && (
                  <h2 className="text-4xl md:text-5xl font-serif mb-4">
                    {block.title}
                  </h2>
                )}
                {block.content && (
                  <p className="text-base md:text-lg leading-8 opacity-80 whitespace-pre-line">
                    {block.content}
                  </p>
                )}
              </div>
            </section>
          );
        }

        return null;
      })}
    </>
  );
};

export default function AboutPage() {
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
            about: {
              blocks: [],
              ...(result?.site?.about || {}),
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
        console.error("Error cargando AboutPage:", error);
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
  const aboutBlocks = data.site?.about?.blocks || [];

  return (
    <div className="min-h-screen bg-white">
      <Header siteData={data.site} colorPalette={colorPalette} />

      <main>
        <section className="px-4 md:px-8 lg:px-10 py-12 md:py-16 bg-white border-b border-black/5">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#9a9a9a] mb-3">
              Nosotros
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-[#111]">
              Sobre TYRELL
            </h1>
          </div>
        </section>

        <AboutSection siteData={data.site} colorPalette={colorPalette} />
        <AboutBlocksSection blocks={aboutBlocks} />
      </main>

      <Footer siteData={data.site} colorPalette={colorPalette} />
      <WhatsAppButton whatsappLink={data.site?.brand?.whatsappLink} />
    </div>
  );
}