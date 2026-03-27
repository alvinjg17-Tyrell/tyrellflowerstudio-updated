import { useEffect, useRef, useState } from "react";
import { MessageCircle, Clock, ArrowRight, Send, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

export const ContactSection = ({ siteData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", message: "" });
  const sectionRef = useRef(null);
  const brand = siteData?.brand || {};
  const contact = siteData?.contact || {};
  
  // Get colors from site data
  const contactColors = siteData?.contactColors || {};
  const bgColor = contactColors.bgColor || "#4F6D5E";
  const labelColor = contactColors.labelColor || "#f4c952";
  const titleColor = contactColors.titleColor || "#FFFFFF";
  const subtitleColor = contactColors.subtitleColor || "#FFFFFF99";
  const buttonBgColor = contactColors.buttonBgColor || "#f4c952";
  const buttonTextColor = contactColors.buttonTextColor || "#FFFFFF";
  const inputBorderColor = contactColors.inputBorderColor || "#f4c952";
  
  // Check if location should be shown
  const showLocation = contact.showLocation !== false && contact.address;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    const whatsappMsg = encodeURIComponent(
      `Hola TYRELL, soy ${formData.name}. ${formData.message}`
    );
    const baseNumber = brand.whatsappLink ? brand.whatsappLink.replace("https://wa.me/", "") : "";
    const whatsappUrl = baseNumber
      ? `https://wa.me/${baseNumber}?text=${whatsappMsg}`
      : `https://wa.me/?text=${whatsappMsg}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Redirigiendo a WhatsApp...");
    setFormData({ name: "", message: "" });
  };

  return (
    <section 
      id="contacto" 
      ref={sectionRef} 
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-[1px]" 
        style={{ background: `linear-gradient(to right, transparent, ${labelColor}33, transparent)` }}
      />
      <div className="absolute top-20 right-0 w-72 h-72 bg-[#D8A7B1]/[0.08] rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: `${labelColor}0D` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-10" style={{ backgroundColor: `${labelColor}66` }} />
            <span 
              className="text-xs tracking-[0.3em] uppercase font-light"
              style={{ color: labelColor }}
            >
              Contacto
            </span>
            <div className="h-[1px] w-10" style={{ backgroundColor: `${labelColor}66` }} />
          </div>
          <h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight"
            style={{ color: titleColor }}
          >
            {contact.title}
          </h2>
          <p 
            className="mt-4 text-lg font-light"
            style={{ color: subtitleColor }}
          >
            {contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="space-y-8">
              {/* WhatsApp */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-full border border-[#D8A7B1]/40 bg-[#D8A7B1]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#D8A7B1]/30 group-hover:border-[#D8A7B1]/60">
                  <MessageCircle className="w-6 h-6 text-[#D8A7B1]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium tracking-wide" style={{ color: titleColor }}>{contact.whatsappLabel}</h3>
                  <p className="mt-1 text-sm font-light" style={{ color: subtitleColor }}>{brand.whatsappNumber || "Respuesta rápida y personalizada"}</p>
                  <a
                    href={brand.whatsappLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm tracking-wider hover:opacity-80 transition-colors duration-300"
                    style={{ color: labelColor }}
                  >
                    <span>Enviar mensaje</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Location - Only show if enabled */}
              {showLocation && (
                <div className="flex gap-5 group">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full border border-[#E8C1B5]/40 bg-[#E8C1B5]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#E8C1B5]/30 group-hover:border-[#E8C1B5]/60">
                    <MapPin className="w-6 h-6 text-[#E8C1B5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium tracking-wide" style={{ color: titleColor }}>Ubicación</h3>
                    <p className="mt-1 text-sm font-light" style={{ color: subtitleColor }}>{contact.address}</p>
                    {brand.locationUrl && (
                      <a
                        href={brand.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 text-sm tracking-wider hover:opacity-80 transition-colors duration-300"
                        style={{ color: labelColor }}
                      >
                        <span>Ver en Google Maps</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div className="flex gap-5 group">
                <div 
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ 
                    border: `1px solid ${labelColor}4D`,
                    backgroundColor: `${labelColor}1A`
                  }}
                >
                  <Clock className="w-6 h-6" style={{ color: labelColor }} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium tracking-wide" style={{ color: titleColor }}>{contact.scheduleTitle}</h3>
                  <p className="mt-1 text-sm font-light" style={{ color: subtitleColor }}>{contact.schedule}</p>
                  <p className="text-sm font-light" style={{ color: subtitleColor }}>{contact.scheduleWeekend}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-wider uppercase mb-2 font-light" style={{ color: subtitleColor }}>Tu nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ingresa tu nombre"
                  className="rounded-none h-12 transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: `${inputBorderColor}4D`,
                    color: titleColor
                  }}
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase mb-2 font-light" style={{ color: subtitleColor }}>Tu mensaje</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Cuéntanos qué necesitas..."
                  rows={5}
                  className="rounded-none transition-all duration-300 resize-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: `${inputBorderColor}4D`,
                    color: titleColor
                  }}
                />
              </div>
              <Button
                type="submit"
                className="w-full py-6 text-sm tracking-[0.2em] uppercase rounded-none transition-all duration-300 hover:opacity-90 hover:shadow-lg group"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor
                }}
              >
                <Send className="mr-2 w-4 h-4" />
                Enviar por WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
