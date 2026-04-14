import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";

const fixImageUrl = (url) => {
  if (!url) return url;
  if (url.includes(".preview.emergentagent.com/api/uploads/")) {
    const match = url.match(/\/api\/uploads\/.*/);
    return match ? match[0] : url;
  }
  return url;
};

const ProductLightbox = ({ product, isOpen, onClose, whatsappLink }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const mediaItems = useMemo(() => {
    const items = [
      product?.image,
      ...(product?.images || []),
      product?.video,
    ]
      .filter(Boolean)
      .map(fixImageUrl)
      .filter((value, index, array) => array.indexOf(value) === index);

    return items;
  }, [product]);

  const activeItem = mediaItems[activeIndex];

  const isVideo = (src) => {
    if (!src) return false;
    return (
      src.includes(".mp4") ||
      src.includes(".webm") ||
      src.includes(".mov") ||
      src.includes("video")
    );
  };

  const getWhatsAppUrl = () => {
    const number = (whatsappLink || "").replace("https://wa.me/", "").replace(/\D/g, "");
    const text = encodeURIComponent(`Hola, quiero pedir el producto: ${product?.name || ""}`);
    return number ? `https://wa.me/${number}?text=${text}` : "#";
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] p-0 overflow-hidden border-0 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-[#f7f4ef] p-4 md:p-6">
            <div className="aspect-[4/5] w-full overflow-hidden bg-white rounded-sm">
              {isVideo(activeItem) ? (
                <video
                  src={activeItem}
                  controls
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

            {mediaItems.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {mediaItems.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`aspect-square overflow-hidden rounded-sm border ${
                      activeIndex === index
                        ? "border-black"
                        : "border-[#e8e0d4]"
                    }`}
                  >
                    {isVideo(item) ? (
                      <div className="w-full h-full bg-black text-white text-xs flex items-center justify-center">
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

          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] leading-tight">
              {product.name}
            </h3>

            {product.price && (
              <p className="mt-4 text-xl font-medium text-[#1a1a1a]">
                {product.price}
              </p>
            )}

            {product.description && (
              <p className="mt-5 text-base leading-7 text-[#4d4d4d]">
                {product.description}
              </p>
            )}

            <div className="mt-8">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 text-sm tracking-wide uppercase transition-all"
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
      </DialogContent>
    </Dialog>
  );
};

const ProductCard = ({ product, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="text-left group"
    >
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
    </button>
  );
};

const CategorySection = ({ category, onOpen }) => {
  const activeProducts = (category.products || []).filter((p) => p.active !== false);

  if (!activeProducts.length) return null;

  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-serif text-[#111]">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-3 text-[#5b5b5b] max-w-2xl">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {activeProducts.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
};

const ServicesSection = ({ categories = [], whatsappLink = "" }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const activeCategories = (categories || []).filter((c) => c.active !== false);

  if (!activeCategories.length) {
    return null;
  }

  return (
    <>
      <section id="catalogo" className="px-4 md:px-8 lg:px-10 py-14 bg-white">
        <div className="max-w-[1600px] mx-auto">
          {activeCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onOpen={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      <ProductLightbox
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsappLink={whatsappLink}
      />
    </>
  );
};

export default ServicesSection;
