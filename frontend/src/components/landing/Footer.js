import { Heart, MapPin, MessageCircle } from "lucide-react";

export const Footer = ({ siteData }) => {
  const brand = siteData?.brand || {};
  const contact = siteData?.contact || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-tyrell-dark to-tyrell-burgundy/40 border-t border-tyrell-rose/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <img
                src="https://customer-assets.emergentagent.com/job_tyrell-floreria/artifacts/8svedb6n_TYRELL_2025_corporativo_blanco.png"
                alt={brand.name || "TYRELL"}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed">{brand.tagline}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] uppercase text-white mb-6">Navegación</h4>
            <ul className="space-y-3">
              {["Inicio", "Nosotros", "Servicios", "Contacto"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector(`#${link.toLowerCase()}`);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-white/40 hover:text-tyrell-gold text-sm font-light tracking-wider transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={brand.catalogUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-tyrell-gold text-sm font-light tracking-wider transition-colors duration-300"
                >
                  Catálogo
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-display text-sm tracking-[0.2em] uppercase text-white mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-tyrell-gold mt-0.5 flex-shrink-0" />
                <a
                  href={brand.locationUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-tyrell-gold text-sm font-light transition-colors duration-300"
                >
                  {contact.address}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-tyrell-gold mt-0.5 flex-shrink-0" />
                <a
                  href={brand.whatsappLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-tyrell-gold text-sm font-light transition-colors duration-300"
                >
                  {brand.whatsappNumber || "WhatsApp"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-light tracking-wider">
            © {currentYear} {brand.name || "TYRELL"} Florería. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-white/25 text-xs font-light">
            <span>Hecho con</span>
            <Heart className="w-3 h-3 text-tyrell-gold fill-tyrell-gold" />
            <span>en {brand.location || "Moyobamba"}</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
