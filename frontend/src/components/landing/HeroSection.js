import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

export const HeroSection = ({ siteData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hero = siteData?.hero || {};
  const brand = siteData?.brand || {};

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToServices = () => {
    const element = document.querySelector("#servicios");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getGenericWhatsAppUrl = () => {
    const number = brand.whatsappLink ? brand.whatsappLink.replace("https://wa.me/", "") : "";
    const message = encodeURIComponent("Hola Tyrell quisiera información sobre ...");
    return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background - Video or Image */}
      <div className="absolute inset-0">
        {hero.useVideo && hero.video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            preload="auto"
            className="w-full h-full object-cover"
            poster={hero.image || undefined}
          >
            <source src={hero.video} type="video/mp4" />
            <source src={hero.video} type="video/quicktime" />
          </video>
        ) : hero.image ? (
          <img
            src={hero.image}
            alt="Arreglos florales TYRELL"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-tyrell-dark" />
        )}
        {/* Fallback image for when video fails on mobile */}
        {hero.useVideo && hero.image && (
          <img
            src={hero.image}
            alt="TYRELL Florería"
            className="absolute inset-0 w-full h-full object-cover video-fallback"
            style={{ display: 'none' }}
            onLoad={(e) => {
              const video = e.target.previousElementSibling;
              if (video && video.tagName === 'VIDEO') {
                video.addEventListener('error', () => {
                  e.target.style.display = 'block';
                  video.style.display = 'none';
                });
              }
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-tyrell-dark/85 via-tyrell-dark/60 to-tyrell-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-tyrell-dark/50 via-transparent to-transparent" />
      </div>

      {/* Gold decorative lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tyrell-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tyrell-gold/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 lg:py-40">
        <div className="max-w-2xl">
          {/* Title */}
          <h1
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <span 
              className="block font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight"
              style={{ color: hero.titleColor || "#FFFFFF" }}
            >
              {hero.title}
            </span>
            <span 
              className="block font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight mt-2"
              style={{ color: hero.highlightColor || "#D4B896" }}
            >
              {hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-8 text-base sm:text-lg font-light leading-relaxed max-w-lg transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ color: hero.subtitleColor || "rgba(255,255,255,0.7)" }}
          >
            {hero.subtitle}
          </p>

          {/* CTAs */}
          <div
            className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <a
              href={getGenericWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-catalog-btn"
            >
              <Button 
                className="px-8 py-6 text-sm tracking-[0.2em] uppercase rounded-none transition-all duration-300 hover:shadow-lg group"
                style={{
                  backgroundColor: hero.ctaButtonColor || "#daa609",
                  color: hero.ctaButtonTextColor || "#FFFFFF"
                }}
              >
                {hero.ctaText || "Ver Catálogo"}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </a>
            <Button
              onClick={scrollToServices}
              variant="outline"
              className="px-8 py-6 text-sm tracking-[0.2em] uppercase rounded-none transition-all duration-300 bg-transparent border-2"
              style={{
                borderColor: hero.ctaSecondaryTextColor || "#FFFFFF",
                color: hero.ctaSecondaryTextColor || "#FFFFFF"
              }}
            >
              {hero.ctaSecondaryText || "Nuestros Servicios"}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={scrollToServices}
          className="flex flex-col items-center gap-2 text-white/50 hover:text-tyrell-gold transition-colors duration-300 group"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Descubrir</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
