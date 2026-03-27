import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";

// Helper function to fix image URLs (convert old domain URLs to relative paths)
const fixImageUrl = (url) => {
  if (!url) return url;
  // If it's a full URL with old domain, extract just the path
  if (url.includes('.preview.emergentagent.com/api/uploads/')) {
    const match = url.match(/\/api\/uploads\/.+/);
    return match ? match[0] : url;
  }
  return url;
};

// Product lightbox for viewing multiple images/videos
const ProductLightbox = ({ product, isOpen, onClose, whatsappLink }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine all media and fix URLs
  const allMedia = [
    product?.image, 
    ...(product?.images || []),
    product?.video
  ].filter(Boolean).map(fixImageUrl);

  const goNext = () => setCurrentIndex(prev => (prev + 1) % allMedia.length);
  const goPrev = () => setCurrentIndex(prev => (prev - 1 + allMedia.length) % allMedia.length);

  const getWhatsAppUrl = () => {
    const number = whatsappLink ? whatsappLink.replace("https://wa.me/", "") : "";
    const productName = product?.name || "este producto";
    const message = encodeURIComponent(`Hola Tyrell, necesito información sobre ${productName}`);
    return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
  };

  if (!product || allMedia.length === 0) return null;

  const currentMedia = allMedia[currentIndex];
  const isVideo = currentMedia?.includes('.mp4') || currentMedia?.includes('.mov') || currentMedia?.includes('.MOV');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-auto max-h-[90vh] p-0 border-0 bg-black/95 shadow-none">
        <div className="relative flex flex-col h-full">
          {/* Close button */}
          <button
            onClick={() => onClose(false)}
            className="absolute top-3 right-3 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main media area */}
          <div className="relative flex-1 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            {/* Navigation arrows */}
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Current media */}
            {isVideo ? (
              <video
                src={currentMedia}
                className="max-w-full max-h-[70vh] object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={currentMedia}
                alt={product.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>

          {/* Bottom info bar */}
          <div className="bg-black/80 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-white font-display text-lg sm:text-xl">{product.name}</h3>
                {product.price && (
                  <p className="text-white/70 text-sm">{product.price}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Counter */}
                {allMedia.length > 1 && (
                  <span className="text-white/50 text-sm">
                    {currentIndex + 1} / {allMedia.length}
                  </span>
                )}
                {/* Pedir button */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-tyrell-gold hover:bg-tyrell-gold-dark text-white text-sm uppercase tracking-wider transition-colors"
                >
                  Pedir
                </a>
              </div>
            </div>

            {/* Thumbnail strip */}
            {allMedia.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {allMedia.map((media, i) => {
                  const isVid = media?.includes('.mp4') || media?.includes('.mov') || media?.includes('.MOV');
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-12 h-12 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                        currentIndex === i ? "border-tyrell-gold" : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      {isVid ? (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-white text-[8px]">VIDEO</span>
                        </div>
                      ) : (
                        <img src={media} alt="" className="w-full h-full object-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Product card component
const ProductCard = ({ product, categoryName, whatsappLink, primaryColor, onClick }) => {
  const allMedia = [product.image, ...(product.images || []), product.video].filter(Boolean).map(fixImageUrl);
  const hasMultipleMedia = allMedia.length > 1;
  const fixedImage = fixImageUrl(product.image);

  const getWhatsAppUrl = () => {
    const number = whatsappLink ? whatsappLink.replace("https://wa.me/", "") : "";
    const productName = product.name || categoryName || "este producto";
    const message = encodeURIComponent(`Hola Tyrell, necesito información sobre ${productName}`);
    return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
  };

  return (
    <div className="w-[140px] sm:w-[160px] lg:w-[180px] flex-shrink-0 snap-start">
      {/* Product Image */}
      <div 
        className="relative aspect-[3/4] bg-gray-100 overflow-hidden group cursor-pointer"
        onClick={onClick}
      >
        {fixedImage ? (
          <img
            src={fixedImage}
            alt={product.name || "Producto"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{
              objectPosition: `${product.imagePosition?.x || 50}% ${product.imagePosition?.y || 50}%`
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
        
        {/* Hover overlay with navigation hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          {hasMultipleMedia && (
            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </div>
          )}
        </div>

        {/* Media count indicator */}
        {hasMultipleMedia && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
            +{allMedia.length - 1}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-2 space-y-1">
        <h4 className="font-display text-sm font-medium leading-tight line-clamp-2 text-gray-900">
          {product.name || "Producto"}
        </h4>
        {product.price && (
          <p className="text-sm font-medium" style={{ color: primaryColor }}>
            {product.price}
          </p>
        )}
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-block mt-1 px-3 py-1 text-[10px] uppercase tracking-wider font-medium transition-all duration-300 hover:opacity-80"
          style={{ 
            backgroundColor: `${primaryColor}15`,
            color: primaryColor
          }}
        >
          Pedir
        </a>
      </div>
    </div>
  );
};

// Category carousel
const CategoryCarousel = ({ category, whatsappLink, primaryColor }) => {
  const scrollContainerRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 180;
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!category.products || category.products.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Category Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl sm:text-2xl text-gray-900 font-medium">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-gray-500 hidden sm:block">{category.description}</p>
        )}
      </div>

      {/* Products Carousel */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 lg:-left-4 top-[30%] -translate-y-1/2 z-20 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {category.products.map((product, index) => (
            <ProductCard
              key={product.id || index}
              product={product}
              categoryName={category.name}
              whatsappLink={whatsappLink}
              primaryColor={primaryColor}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 lg:-right-4 top-[30%] -translate-y-1/2 z-20 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Product Lightbox */}
      <ProductLightbox
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsappLink={whatsappLink}
      />
    </div>
  );
};

export const ServicesSection = ({ services, siteData, colorPalette, categories }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const brand = siteData?.brand || {};
  const svcSection = siteData?.services || {};
  
  // Get colors
  const titleColor = svcSection.titleColor || '#1a1a1a';
  const highlightColor = svcSection.highlightColor || '#D8A7B1';
  const subtitleColor = svcSection.subtitleColor || '#666666';
  const labelColor = svcSection.labelColor || '#D8A7B1';
  const primaryColor = svcSection.pedir_buttonColor || colorPalette?.primary || '#D8A7B1';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Use categories if available
  const hasCategories = categories && categories.length > 0;

  return (
    <section id="servicios" ref={sectionRef} className="relative py-16 lg:py-24 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tyrell-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p 
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: labelColor }}
          >
            {svcSection.label || "Nuestros Servicios"}
          </p>
          <h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight"
            style={{ color: titleColor }}
          >
            {svcSection.title || "Creaciones para cada"}
            <span style={{ color: highlightColor }}> {svcSection.titleHighlight || "momento"}</span>
          </h2>
          <p 
            className="mt-4 text-base lg:text-lg font-light max-w-xl mx-auto"
            style={{ color: subtitleColor }}
          >
            {svcSection.subtitle || "Descubre nuestra colección de arreglos florales y servicios diseñados para sorprender."}
          </p>
        </div>

        {/* Categories with Products */}
        {hasCategories ? (
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {categories.map((category) => (
              <CategoryCarousel
                key={category.id}
                category={category}
                whatsappLink={brand.whatsappLink}
                primaryColor={primaryColor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No hay productos disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
};
