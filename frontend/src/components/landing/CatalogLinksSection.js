import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

export const CatalogLinksSection = ({ catalogLinks, siteData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Get colors from site data or use defaults
  const catalogColors = siteData?.catalogColors || {};
  const labelColor = catalogColors.labelColor || "#f4c952";
  const titleColor = catalogColors.titleColor || "#1a1a1a";
  const highlightColor = catalogColors.highlightColor || "#f4c952";
  const buttonBgColor = catalogColors.buttonBgColor || "#f4c952";
  const buttonTextColor = catalogColors.buttonTextColor || "#FFFFFF";
  const lineColor = catalogColors.lineColor || "#f4c952";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!catalogLinks || catalogLinks.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-24 bg-gradient-to-b from-white via-tyrell-rose-light/15 to-white overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-[1px]" 
        style={{ background: `linear-gradient(to right, transparent, ${lineColor}26, transparent)` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-10" style={{ backgroundColor: `${lineColor}66` }} />
            <span 
              className="text-xs tracking-[0.3em] uppercase font-light"
              style={{ color: labelColor }}
            >
              Nuestros Catálogos
            </span>
            <div className="h-[1px] w-10" style={{ backgroundColor: `${lineColor}66` }} />
          </div>
          <h2 
            className="font-display text-3xl sm:text-4xl font-light tracking-tight mb-10"
            style={{ color: titleColor }}
          >
            Explora nuestras <span style={{ color: highlightColor }}>colecciones</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {catalogLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <Button 
                  className="px-8 py-6 text-sm tracking-[0.15em] uppercase rounded-none transition-all duration-300 hover:opacity-90 hover:shadow-lg group"
                  style={{ 
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor
                  }}
                >
                  {link.title}
                  <ExternalLink className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
