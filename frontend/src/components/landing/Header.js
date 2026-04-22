import { useState, useEffect } from "react";
import { Menu, X, MapPin, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const normalizeNavItems = (items = []) =>
  (items || [])
    .filter((item) => item && item.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

const NavLinkRenderer = ({ item, className, onClick, children }) => {
  if (item.type === "route") {
    return (
      <Link to={item.target || "/"} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={item.target || "#"}
      onClick={onClick}
      target={item.type === "external" ? "_blank" : undefined}
      rel={item.type === "external" ? "noopener noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  );
};

export const Header = ({ siteData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  const brand = siteData?.brand || {};
  const header = siteData?.header || {};

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = normalizeNavItems(header.navItems || []);
  const dropdownBgColor = header.dropdownBgColor || "#B76E79";
  const dropdownTextColor = header.dropdownTextColor || "#FFFFFF";

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setOpenDesktopDropdown(null);
    setOpenMobileDropdown(null);
  };

  const handleAnchorClick = (e, target) => {
    if (!target || !target.startsWith("#")) {
      closeMenus();
      return;
    }

    e.preventDefault();
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    closeMenus();
  };

  const renderDesktopItem = (item) => {
    const children = normalizeNavItems(item.children || []);

    if (item.type === "dropdown") {
      return (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setOpenDesktopDropdown(item.id)}
          onMouseLeave={() => setOpenDesktopDropdown(null)}
        >
          <button
            type="button"
            className="text-sm tracking-wider uppercase font-light transition-all duration-300 hover:opacity-100 relative group text-white/80 hover:text-white inline-flex items-center gap-1"
          >
            {item.label}
            <ChevronDown className="w-4 h-4" />
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-tyrell-gold transition-all duration-300 group-hover:w-full" />
          </button>

          <div
            className={`absolute top-full left-0 pt-4 transition-all duration-200 ${
              openDesktopDropdown === item.id
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="min-w-[240px] border shadow-lg py-2"
              style={{
                backgroundColor: dropdownBgColor,
                color: dropdownTextColor,
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              {children.map((child) => (
                <NavLinkRenderer
                  key={child.id}
                  item={child}
                  onClick={(e) => {
                    if (child.type === "anchor" && child.target?.startsWith("#")) {
                      handleAnchorClick(e, child.target);
                    } else {
                      closeMenus();
                    }
                  }}
                  className="block px-4 py-3 text-sm tracking-wide transition-colors hover:bg-white/10"
                >
                  {child.label}
                </NavLinkRenderer>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <NavLinkRenderer
        key={item.id}
        item={item}
        onClick={(e) => {
          if (item.type === "anchor" && item.target?.startsWith("#")) {
            handleAnchorClick(e, item.target);
          } else {
            closeMenus();
          }
        }}
        className="text-sm tracking-wider uppercase font-light transition-all duration-300 hover:opacity-100 relative group text-white/80 hover:text-white"
      >
        {item.label}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-tyrell-gold transition-all duration-300 group-hover:w-full" />
      </NavLinkRenderer>
    );
  };

  const renderMobileItem = (item) => {
    const children = normalizeNavItems(item.children || []);

    if (item.type === "dropdown") {
      const isOpen = openMobileDropdown === item.id;

      return (
        <div key={item.id}>
          <button
            type="button"
            onClick={() =>
              setOpenMobileDropdown((prev) => (prev === item.id ? null : item.id))
            }
            className="w-full flex items-center justify-between text-sm tracking-wider uppercase text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2"
          >
            <span>{item.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div
              className="ml-3 mt-2 mb-2 rounded overflow-hidden"
              style={{ backgroundColor: dropdownBgColor, color: dropdownTextColor }}
            >
              {children.map((child) => (
                <NavLinkRenderer
                  key={child.id}
                  item={child}
                  onClick={(e) => {
                    if (child.type === "anchor" && child.target?.startsWith("#")) {
                      handleAnchorClick(e, child.target);
                    } else {
                      closeMenus();
                    }
                  }}
                  className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors"
                >
                  {child.label}
                </NavLinkRenderer>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLinkRenderer
        key={item.id}
        item={item}
        onClick={(e) => {
          if (item.type === "anchor" && item.target?.startsWith("#")) {
            handleAnchorClick(e, item.target);
          } else {
            closeMenus();
          }
        }}
        className="block text-sm tracking-wider uppercase text-tyrell-dark/70 hover:text-tyrell-dark transition-colors duration-300 py-2"
      >
        {item.label}
      </NavLinkRenderer>
    );
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
            {navItems.map(renderDesktopItem)}

            <a
              href={brand.catalogUrl || "#"}
              target="_blank"
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
          isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/98 backdrop-blur-xl border-t border-tyrell-gold/10 px-4 py-6 space-y-2">
          {navItems.map(renderMobileItem)}

          <a
            href={brand.catalogUrl || "#"}
            target="_blank"
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