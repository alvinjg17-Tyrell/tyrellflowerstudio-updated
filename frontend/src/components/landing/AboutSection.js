import { useEffect, useRef, useState } from "react";
import { Flower2, Sparkles, Clock, Heart, Star, Gift, Truck, Shield, Award, Leaf } from "lucide-react";

const iconMap = {
  Flower2, Sparkles, Clock, Heart, Star, Gift, Truck, Shield, Award, Leaf
};

export const AboutSection = ({ siteData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const about = siteData?.about || {};

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setIsVisible(true);},
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="nosotros" ref={sectionRef} className="relative py-24 lg:py-32 bg-[#F5F1EB] overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8A7B1]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8C1B5]/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-tyrell-gold/[0.05] rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-10 bg-tyrell-gold/40" />
            <span className="text-tyrell-gold text-xs tracking-[0.3em] uppercase font-light">{about.label || "Conócenos"}</span>
            <div className="h-[1px] w-10 bg-tyrell-gold/40" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tyrell-dark font-light tracking-tight">{about.title}</h2>
          <p className="mt-4 text-tyrell-dark/50 text-lg font-light">{about.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-tyrell-gold/20 z-0" />
              <img src={about.image} alt="Florería TYRELL" className="relative z-10 w-full h-[400px] lg:h-[500px] object-cover" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D8A7B1]/30 z-0" />
            </div>
            <div className="absolute -bottom-6 -right-2 lg:right-8 z-20 bg-white shadow-[0_10px_40px_rgba(218,166,9,0.15)] px-6 py-4">
              <div className="text-center">
                <span className="block font-display text-3xl text-tyrell-gold font-light">{about.badgeNumber || "+2000"}</span>
                <span className="text-[11px] text-tyrell-dark/60 tracking-wider uppercase">{about.badgeLabel || "Arreglos Entregados"}</span>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <p className="text-tyrell-dark/60 text-base lg:text-lg leading-relaxed font-light mb-10">{about.description}</p>
            <div className="space-y-8">
              {(about.features || []).map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Flower2;
                return (
                  <div key={index} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#D8A7B1]/50 bg-[#D8A7B1]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#D8A7B1]/40 group-hover:border-[#D8A7B1]/70">
                      <IconComponent className="w-5 h-5 text-[#B76E79]" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-tyrell-dark font-medium tracking-wide">{feature.title}</h3>
                      <p className="mt-1 text-tyrell-dark/50 text-sm font-light leading-relaxed">{feature.description}</p>
                    </div>
                  </div>);

              })}
            </div>
          </div>
        </div>
      </div>
    </section>);

};