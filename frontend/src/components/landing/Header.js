import { useState, useEffect } from "react";
import { Menu, X, MapPin, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const Header = ({ siteData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

  const brand = siteData?.brand || {};
  const header = siteData?.header || {};

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: header.navItems?.[0] || "Inicio", to: "/", type: "route" },
    { label: header.navItems?.[1] || "Nosotros", to: "/nosotros", type: "route" },
    { label: header.navItems?.[2] || "Servicios", to: "#", type: "dropdown" },
    { label: header.navItems?.[3] || "Contacto", to: "/contacto", type: "route" },
  ];

  const productLinks = [
    { label: "Ver destacados", href: "/#services" },
    { label: "Ver todo", href: "/#catalogo-completo" },
  ];

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProductsOpen(false);
    setIsProductsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-tyrell-burgundy/95 backdrop-blur-xl shadow-[0_2px_30px_rgba(183,110,121,0.2)]"
          : "bg-transparent"
      }`}
    >
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div
          className="backdrop-blur-sm"
          style={{ backgroundColor: header.topBarBgColor || "#B76E79" }}
        >
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-1.5 text-xs"
            style={{ color: header.topBarTextColor || "#FFFFFF" }}
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-tyrell-gold" />
                {header.topBarLeft || brand.location}
              </span>
            </div>
            <span className="hidden sm:block font-light tracking-wider">
              {header.topBarRight || ""}
            </span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" onClick={closeMenus} className="flex items-center">
            <img
              src="https://customer-assets.emergentagent.com/job_tyrell-floreria/artifacts/8svedb6n_TYRELL_2025_corporativo_blanco.png"
              alt={brand.name || "TYRELL"}
              className="h-12 lg:h-14 w-auto object-contain transition-all duration-500"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.type === "dropdown") {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    <button
                      type="button"
                      className="text-sm tracking-wider uppercase font-light transition-all duration-300 hover:opacity-100 relative group text-white/80 hover:text-white inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-tyrell-gold transition-all duration-300 group-hover:w-full" />
                    </button>

                    <div
                      className={`absolute top-full left-0 pt-4 transition-all duration-200 ${
                        isProductsOpen
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="min-w-[220px] bg-white/98 backdrop-blur-xl border border-tyrell-gold/10 shadow-lg py-2">
                        {productLinks.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 text-sm tracking-wide text-tyrell-dark/80 hover:text-tyrell-dark hover:bg-tyrell-gold/5 transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMenus}
                  className="text-sm tracking-wider uppercase font-light transition-all duration-300 hover:opacity-100 relative group text-white/80 hover:text-white"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-tyrell-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}

            <a
              href={brand.catalogUrl || "/catalogos"}
              target={brand.catalogUrl ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              <Button
                className="text-sm tracking-wider uppercase px-6 py-2 rounded-none border-0 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: header.ctaButtonColor || "#D8A7B1",
                  color: header.ctaTextColor || "#FFFFFF",
                }}
              >
                {header.ctaText || "Ver Catálogo"}
              </Button>
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 transition-colors duration-300 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/98 backdrop-blur-xl border-t border-tyrell-gold/10 px-4 py-6 space-y-2">
          <Link
            to="/"
            onClick={closeMenus}
            className="block text-sm tracking-wider uppercase text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2"
          >
            {header.navItems?.[0] || "Inicio"}
          </Link>

          <Link
            to="/nosotros"
            onClick={closeMenus}
            className="block text-sm tracking-wider uppercase text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2"
          >
            {header.navItems?.[1] || "Nosotros"}
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileProductsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-sm tracking-wider uppercase text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2"
          >
            <span>{header.navItems?.[2] || "Servicios"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isMobileProductsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMobileProductsOpen && (
            <div className="pl-4 pb-2">
              {productLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className="block text-sm text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          <Link
            to="/contacto"
            onClick={closeMenus}
            className="block text-sm tracking-wider uppercase text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2"
          >
            {header.navItems?.[3] || "Contacto"}
          </Link>

          <a
            href={brand.catalogUrl || "/catalogos"}
            target={brand.catalogUrl ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="block pt-2"
          >
            <Button
              className="w-full text-sm tracking-wider uppercase rounded-none"
              style={{
                backgroundColor: header.ctaButtonColor || "#D8A7B1",
                color: header.ctaTextColor || "#FFFFFF",
              }}
            >
              {header.ctaText || "Ver Catálogo"}
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};