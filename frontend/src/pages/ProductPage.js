import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "../components/landing/Header";
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
  },
  categories: [],
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

const isVideoFile = (src = "") => {
  const value = src.toLowerCase();
  return (
    value.includes(".mp4") ||
    value.includes(".mov") ||
    value.includes(".webm") ||
    value.includes(".m4v")
  );
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

const MoreProductsSection = ({ categories = [], currentSlug = "" }) => {
  const products = useMemo(() => {
    return (categories || [])
      .filter((category) => category.active !== false)
      .flatMap((category) =>
        (category.products || []).filter((product) => {
          const slug = product.slug || slugify(product.name || "");
          return product.active !== false && slug !== currentSlug;
        })
      );
  }, [categories, currentSlug]);

  if (!products.length) return null;

  return (
    <section className="px-4 md:px-8 lg:px-10 py-16 bg-white border-t border-black/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#9a9a9a] mb-3">
            Más productos
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#111]">
            Descubre más
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default function ProductPage() {
  const { slug } = useParams();
  const [siteData, setSiteData] = useState(fallbackData.site);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        const [content, productResponse] = await Promise.all([
          api.getContent(),
          api.getProductBySlug(slug),
        ]);

        const finalSite = {
          ...fallbackData.site,
          ...(content?.site || {}),
          brand: {
            ...fallbackData.site.brand,
            ...(content?.site?.brand || {}),
          },
          colorPalette: {
            ...fallbackData.site.colorPalette,
            ...(content?.site?.colorPalette || {}),
          },
        };

        const palette = finalSite.colorPalette;
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

        setSiteData(finalSite);
        setCategories(content?.categories || []);
        setProduct(productResponse?.product || null);
        setCategory(productResponse?.category || null);
        setActiveIndex(0);
      } catch (error) {
        console.error("Error cargando producto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [slug]);

  const mediaItems = useMemo(() => {
    if (!product) return [];
    return [product.image, ...(product.images || []), product.video]
      .filter(Boolean)
      .map(fixImageUrl);
  }, [product]);

  const activeMedia = mediaItems[activeIndex];

  const whatsappLink =
    siteData?.brand?.whatsappLink || "https://wa.me/51910770284";

  const handleWhatsAppClick = () => {
    if (!product) return;

    const message = encodeURIComponent(
      `Hola, quiero información sobre ${product.name || "este producto"}${
        product.price ? ` (${product.price})` : ""
      }`
    );

    const separator = whatsappLink.includes("?") ? "&" : "?";
    window.open(`${whatsappLink}${separator}text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tyrell-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tyrell-gold animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header siteData={siteData} colorPalette={siteData.colorPalette} />
        <div className="pt-40 px-4 text-center">
          <h1 className="text-3xl font-serif text-[#111] mb-4">
            Producto no encontrado
          </h1>
          <Link
            to="/"
            className="inline-flex px-6 py-3 bg-[#e8d8b8] text-[#7a5a1f] uppercase text-sm tracking-[0.18em]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header siteData={siteData} colorPalette={siteData.colorPalette} />

      <main className="pt-28 md:pt-36">
        <section className="px-4 md:px-8 lg:px-10 pb-16">
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-[120px_minmax(0,760px)_minmax(320px,1fr)] gap-6 lg:gap-10 items-start">
            <div className="hidden lg:flex flex-col gap-4">
              {mediaItems.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`overflow-hidden border ${
                    activeIndex === index
                      ? "border-[#111]"
                      : "border-black/10"
                  }`}
                >
                  {isVideoFile(item) ? (
                    <video
                      src={item}
                      className="w-full aspect-[4/5] object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={item}
                      alt=""
                      className="w-full aspect-[4/5] object-cover"
                    />
                  )}
                </button>
              ))}
            </div>

            <div>
              <div className="relative bg-[#f7f4ef] overflow-hidden">
                {activeMedia && isVideoFile(activeMedia) ? (
                  <video
                    src={activeMedia}
                    className="w-full aspect-[4/5] object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={activeMedia}
                    alt={product.name}
                    className="w-full aspect-[4/5] object-cover"
                    style={{
                      objectPosition: `${product.imagePosition?.x || 50}% ${
                        product.imagePosition?.y || 50
                      }%`,
                    }}
                  />
                )}

                {mediaItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((prev) =>
                          prev === 0 ? mediaItems.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((prev) =>
                          prev === mediaItems.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {mediaItems.length > 1 && (
                <div className="lg:hidden flex gap-3 overflow-x-auto mt-4">
                  {mediaItems.map((item, index) => (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`w-24 flex-shrink-0 overflow-hidden border ${
                        activeIndex === index
                          ? "border-[#111]"
                          : "border-black/10"
                      }`}
                    >
                      {isVideoFile(item) ? (
                        <video
                          src={item}
                          className="w-full aspect-[4/5] object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={item}
                          alt=""
                          className="w-full aspect-[4/5] object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-8">
              {category?.name && (
                <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] text-[#9a9a9a] mb-4">
                  {category.name}
                </p>
              )}

              <h1 className="text-4xl md:text-6xl font-serif text-[#111] leading-none">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="mt-4 text-lg text-[#666]">{product.subtitle}</p>
              )}

              {product.price && (
                <p className="mt-6 text-2xl md:text-3xl text-[#111]">
                  {product.price}
                </p>
              )}

              {product.description && (
                <div className="mt-8 text-[#444] leading-7 whitespace-pre-line">
                  {product.description}
                </div>
              )}

              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="px-8 py-4 uppercase tracking-[0.18em] text-sm"
                  style={{
                    backgroundColor: product.buttonBgColor || "#e8d8b8",
                    color: product.buttonTextColor || "#7a5a1f",
                  }}
                >
                  {product.buttonText || "Pedir"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <MoreProductsSection categories={categories} currentSlug={slug} />
      </main>

      <Footer siteData={siteData} colorPalette={siteData.colorPalette} />
      <WhatsAppButton whatsappLink={siteData?.brand?.whatsappLink} />
    </div>
  );
}