import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminBrand } from "../components/admin/AdminBrand";
import { AdminHero } from "../components/admin/AdminHero";
import { AdminAbout } from "../components/admin/AdminAbout";
import { AdminServices } from "../components/admin/AdminServices";
import { AdminServicesSection } from "../components/admin/AdminServicesSection";
import { AdminCatalogLinks } from "../components/admin/AdminCatalogLinks";
import { AdminContact } from "../components/admin/AdminContact";
import { AdminFooter } from "../components/admin/AdminFooter";
import { AdminHeader as AdminHeaderSection } from "../components/admin/AdminHeaderSection";
import { AdminColorPalette } from "../components/admin/AdminColorPalette";
import { AdminDynamicSections } from "../components/admin/AdminDynamicSections";
import { AdminCategories } from "../components/admin/AdminCategories";
import { AdminSectionOrder } from "../components/admin/AdminSectionOrder";
import { Toaster, toast } from "sonner";
import { Loader2, Lock, Mail, Eye, EyeOff, LogOut } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const TABS = [
  { id: "brand", label: "Marca" },
  { id: "colors", label: "Colores" },
  { id: "order", label: "Orden" },
  { id: "header", label: "Encabezado" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "Nosotros" },
  { id: "categories", label: "Productos" },
  { id: "sections", label: "Secciones" },
  { id: "catalogs", label: "Catálogos" },
  { id: "contact", label: "Contacto" },
  { id: "footer", label: "Pie" },
];

// Login Component
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login(email, password);
      localStorage.setItem("admin_token", response.access_token);
      onLogin();
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tyrell-ivory flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-tyrell-olive font-light tracking-wide">TYRELL</h1>
            <p className="text-tyrell-rose-dark text-sm mt-2 tracking-wider">Panel de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-wider uppercase text-tyrell-olive/70 mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tyrell-rose" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="pl-10 h-12 rounded-none border-tyrell-rose/30 focus:border-tyrell-gold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-tyrell-olive/70 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tyrell-rose" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="pl-10 pr-10 h-12 rounded-none border-tyrell-rose/30 focus:border-tyrell-gold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tyrell-rose hover:text-tyrell-rose-dark"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none tracking-wider"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("brand");
  const [siteContent, setSiteContent] = useState(null);
  const [services, setServices] = useState([]);
  const [catalogLinks, setCatalogLinks] = useState([]);
  const [dynamicSections, setDynamicSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colorPalette, setColorPalette] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        try {
          await api.verifyAuth(token);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem("admin_token");
        }
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getContent();
      setSiteContent(data.site);
      setServices(data.services);
      setCatalogLinks(data.catalogLinks || []);
      setDynamicSections(data.dynamicSections || []);
      setCategories(data.categories || []);
      setColorPalette(data.site?.colorPalette || null);
    } catch (err) {
      toast.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const saveSiteContent = async (updatedContent) => {
    try {
      setSaving(true);
      await api.updateContent(updatedContent);
      setSiteContent(updatedContent);
      toast.success("Cambios guardados correctamente");
    } catch (err) {
      toast.error("Error guardando cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-tyrell-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tyrell-gold animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tyrell-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tyrell-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tyrell-ivory">
      <Toaster position="top-center" richColors />
      
      {/* Header with logout */}
      <div className="bg-white border-b border-tyrell-rose/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-tyrell-olive font-light tracking-wide">TYRELL Admin</h1>
            <p className="text-tyrell-rose text-xs tracking-wider">Panel de Administración</p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-tyrell-olive/60 hover:text-tyrell-olive text-sm tracking-wider"
            >
              Ver sitio
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-tyrell-rose-dark hover:text-tyrell-rose text-sm tracking-wider transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-4 mb-8 border-b border-tyrell-rose/15">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-tyrell-gold text-white"
                  : "text-tyrell-olive/50 hover:text-tyrell-olive/80 hover:bg-tyrell-rose/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "brand" && siteContent && (
          <AdminBrand content={siteContent} onSave={saveSiteContent} saving={saving} />
        )}
        {activeTab === "colors" && (
          <AdminColorPalette 
            colorPalette={colorPalette} 
            onSave={(palette) => setColorPalette(palette)} 
            saving={saving} 
          />
        )}
        {activeTab === "order" && siteContent && (
          <AdminSectionOrder content={siteContent} onSave={saveSiteContent} saving={saving} />
        )}
        {activeTab === "header" && siteContent && (
          <AdminHeaderSection content={siteContent} onSave={saveSiteContent} saving={saving} />
        )}
        {activeTab === "hero" && siteContent && (
          <AdminHero content={siteContent} onSave={saveSiteContent} saving={saving} />
        )}
        {activeTab === "about" && siteContent && (
          <AdminAbout content={siteContent} onSave={saveSiteContent} saving={saving} />
        )}
        {activeTab === "categories" && (
          <>
            <AdminServicesSection content={siteContent} onSave={saveSiteContent} saving={saving} />
            <AdminCategories categories={categories} setCategories={setCategories} />
          </>
        )}
        {activeTab === "sections" && (
          <AdminDynamicSections sections={dynamicSections} setSections={setDynamicSections} />
        )}
        {activeTab === "catalogs" && siteContent && (
          <AdminCatalogLinks 
            catalogLinks={catalogLinks} 
            setCatalogLinks={setCatalogLinks} 
            content={siteContent}
            onSave={saveSiteContent}
            saving={saving}
          />
        )}
        {activeTab === "contact" && siteContent && (
          <AdminContact content={siteContent} onSave={saveSiteContent} saving={saving} />
        )}
        {activeTab === "footer" && siteContent && (
          <AdminFooter content={siteContent} onSave={saveSiteContent} saving={saving} />
        )}
      </div>
    </div>
  );
}
