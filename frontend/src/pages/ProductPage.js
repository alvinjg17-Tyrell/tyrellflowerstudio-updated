import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://tyrellflowerstudio-updated-production.up.railway.app";

const fixImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
  return `${BACKEND_URL}/${url}`;
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

export default function ProductPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const categories = await api.getCategories();
        let foundProduct = null;
        let foundCategory = "";

        for (const category of categories || []) {
          for (const item of category.products || []) {
            const itemSlug = item.slug || slugify(item.name || "");
            if (itemSlug === slug) {
              foundProduct = { ...item, slug: itemSlug };
              foundCategory = category.name || "";
              break;
            }
          }
          if (foundProduct) break;
        }

        setProduct(foundProduct);
        setCategoryName(foundCategory);
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const mediaItems = useMemo(() => {
    if (!product) return [];
    return [product.image, ...(product.images || []), product.video]
      .filter(Boolean)
      .map(fixImageUrl)
      .filter((value, index, array) => array.indexOf(value) === index);
  }, [product]);

  useEffect(() => {
    setActiveIndex(0);
  }, [product]);

  const activeItem = mediaItems[activeIndex];

  const isVideo = (src) => {
    if (!src) return false;
    const value = src.toLowerCase();
    return (
      value.includes(".mp4") ||
      value.includes(".webm") ||
      value.includes(".mov") ||
      value.includes(".m4v")
    );
  };

  const getWhatsAppUrl = () => {
    const fallback = "51910770284";
    const rawWhatsapp =
      product?.whatsappLink ||
      product?.contactWhatsapp ||
      product?.contact?.whatsapp ||
      fallback;

    const number = rawWhatsapp
      .replace("https://wa.me/", "")
      .replace(/\D/g, "");

    const text = encodeURIComponent(
      `Hola, quiero pedir este producto: ${product?.name || ""}`
    );

    return `https://wa.me/${number}?text=${text}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-[#6b6b6b]">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-sm text-[#8b6e3b] hover:underline">
            ← Volver al inicio
          </Link>
          <h1 className="mt-6 text-3xl md:text-4xl font-serif text-[#1a1a1a]">
            Producto no encontrado
          </h1>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-[1500px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-6 md:mb-8">
          <Link to="/" className="text-sm text-[#8b6e3b] hover:underline">
            ← Volver al inicio
          </Link>

          {categoryName && (
            <p className="mt-3 text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#9a9a9a]">
              {categoryName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[90px_minmax(0,760px)_minmax(320px,1fr)] gap-5 md:gap-8 xl:gap-12 items-start">
          {/* Miniaturas PC */}
          <div className="hidden xl:flex flex-col gap-4 pt-2">
            {mediaItems.map((item, index) => (
              <button
                key={`${item}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`w-[78px] h-[102px] overflow-hidden border transition-all ${
                  activeIndex === index
                    ? "border-[#1a1a1a]"
                    : "border-[#e8e0d6]"
                }`}
              >
                {isVideo(item) ? (
                  <div className="w-full h-full bg-black text-white text-[11px] flex items-center justify-center">
                    VIDEO
                  </div>
                ) : (
                  <img
                    src={item}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Imagen principal */}
          <div>
            <div className="w-full aspect-[4/5] bg-[#f7f4ef] overflow-hidden">
              {activeItem && isVideo(activeItem) ? (
                <video
                  src={activeItem}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeItem}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Miniaturas móvil/tablet */}
            {mediaItems.length > 1 && (
              <div className="xl:hidden grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                {mediaItems.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`aspect-square overflow-hidden border ${
                      activeIndex === index
                        ? "border-[#1a1a1a]"
                        : "border-[#e8e0d6]"
                    }`}
                  >
                    {isVideo(item) ? (
                      <div className="w-full h-full bg-black text-white text-[11px] flex items-center justify-center">
                        VIDEO
                      </div>
                    ) : (
                      <img
                        src={item}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="pt-1 md:pt-4 xl:pt-8">
            <h1 className="text-[30px] sm:text-[38px] md:text-[48px] xl:text-[52px] font-serif leading-[1.02] tracking-[0.02em] text-[#161616] uppercase">
              {product.name}
            </h1>

            {product.price && (
              <p className="mt-4 md:mt-5 text-[24px] md:text-[30px] text-[#202020]">
                {product.price}
              </p>
            )}

            {product.tag && (
              <p className="mt-3 text-sm text-[#8b6e3b]">
                {product.tag}
              </p>
            )}

            {product.subtitle && (
              <p className="mt-6 text-base md:text-lg text-[#444] leading-7">
                {product.subtitle}
              </p>
            )}

            {product.description && (
              <div className="mt-5">
                <p className="text-[15px] md:text-base leading-7 text-[#4b4b4b] whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-8 md:mt-10">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center min-w-[190px] px-8 py-3 text-sm uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: product.buttonBgColor || "#e8d8b8",
                  color: product.buttonTextColor || "#7a5a1f",
                }}
              >
                {product.buttonText || "PEDIR"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}