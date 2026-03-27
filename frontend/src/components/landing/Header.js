import { useState, useEffect } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { Button } from "../ui/button";

export const Header = ({ siteData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  { label: header.navItems?.[0] || "Inicio", href: "#inicio" },
  { label: header.navItems?.[1] || "Nosotros", href: "#nosotros" },
  { label: header.navItems?.[2] || "Servicios", href: "#servicios" },
  { label: header.navItems?.[3] || "Contacto", href: "#contacto" }];


  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ?
      "bg-tyrell-burgundy/95 backdrop-blur-xl shadow-[0_2px_30px_rgba(183,110,121,0.2)]" :
      "bg-transparent"}`
      }>

      {/* Top bar */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
        isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"}`
        }>

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

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => scrollToSection(e, "#inicio")}
            className="flex items-center"
          >
            <img
              src="https://customer-assets.emergentagent.com/job_tyrell-floreria/artifacts/8svedb6n_TYRELL_2025_corporativo_blanco.png"
              alt={brand.name || "TYRELL"}
              className="h-12 lg:h-14 w-auto object-contain transition-all duration-500"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm tracking-wider uppercase font-light transition-all duration-300 hover:opacity-100 relative group text-white/80 hover:text-white">

                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-tyrell-gold transition-all duration-300 group-hover:w-full" />
              </a>
            )}
            <a
              href={brand.catalogUrl || "#"}
              target="_blank"
              rel="noopener noreferrer">

              <Button 
                className="text-sm tracking-wider uppercase px-6 py-2 rounded-none border-0 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: header.ctaButtonColor || "#D8A7B1",
                  color: header.ctaTextColor || "#FFFFFF"
                }}
              >
                {header.ctaText || "Ver Catálogo"}
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 transition-colors duration-300 text-white">

            {isMobileMenuOpen ?
            <X className="w-6 h-6" /> :

            <Menu className="w-6 h-6" />
            }
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-500 overflow-hidden ${
        isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`
        }>

        <div className="bg-white/98 backdrop-blur-xl border-t border-tyrell-gold/10 px-4 py-6 space-y-4">
          {navLinks.map((link) =>
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => scrollToSection(e, link.href)}
            className="block text-sm tracking-wider uppercase text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2">

              {link.label}
            </a>
          )}
          <a
            href={brand.catalogUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block">

            <Button 
              className="w-full text-sm tracking-wider uppercase rounded-none"
              style={{
                backgroundColor: header.ctaButtonColor || "#D8A7B1",
                color: header.ctaTextColor || "#FFFFFF"
              }}
            >
              {header.ctaText || "Ver Catálogo"}
            </Button>
          </a>
        </div>
      </div>
    </header>);

};