import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Save, Loader2 } from "lucide-react";
import { InlineColorPicker } from "./InlineColorPicker";

export const AdminHeaderSection = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content.header || {
    topBarLeft: "Jirón Esperanza 210, Moyobamba, Perú",
    topBarRight: "",
    navItems: ["INICIO", "NOSOTROS", "SERVICIOS", "CONTACTO"],
    ctaText: "VER CATÁLOGO",
    ctaButtonColor: "#D8A7B1",
    ctaTextColor: "#FFFFFF",
    topBarBgColor: "#B76E79",
    topBarTextColor: "#FFFFFF"
  });

  useEffect(() => { 
    setForm(content.header || {
      topBarLeft: content.brand?.location || "Jirón Esperanza 210, Moyobamba, Perú",
      topBarRight: "",
      navItems: ["INICIO", "NOSOTROS", "SERVICIOS", "CONTACTO"],
      ctaText: "VER CATÁLOGO",
      ctaButtonColor: "#D8A7B1",
      ctaTextColor: "#FFFFFF",
      topBarBgColor: "#B76E79",
      topBarTextColor: "#FFFFFF"
    }); 
  }, [content]);

  const handleSave = () => {
    onSave({ ...content, header: form });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-tyrell-olive font-light">Encabezado de la Página</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 tracking-wider text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      <div className="bg-white border border-tyrell-rose/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark">Barra Superior</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Fondo:</span>
            <InlineColorPicker
              value={form.topBarBgColor}
              onChange={(color) => update("topBarBgColor", color)}
              label="Color de fondo barra superior"
            />
            <span className="text-xs text-gray-500">Texto:</span>
            <InlineColorPicker
              value={form.topBarTextColor}
              onChange={(color) => update("topBarTextColor", color)}
              label="Color de texto barra superior"
            />
          </div>
        </div>
        
        {/* Preview */}
        <div 
          className="p-3 text-center text-sm"
          style={{ backgroundColor: form.topBarBgColor || "#B76E79", color: form.topBarTextColor || "#FFFFFF" }}
        >
          <span>{form.topBarLeft || "Ubicación"}</span>
          {form.topBarRight && <span className="ml-4">{form.topBarRight}</span>}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">Texto izquierdo (ubicación)</label>
            <Input 
              value={form.topBarLeft || ""} 
              onChange={e => update("topBarLeft", e.target.value)} 
              className="rounded-none border-tyrell-rose/20 h-11" 
              placeholder="Ej: Jirón Esperanza 210, Moyobamba, Perú"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">Texto derecho (opcional)</label>
            <Input 
              value={form.topBarRight || ""} 
              onChange={e => update("topBarRight", e.target.value)} 
              className="rounded-none border-tyrell-rose/20 h-11" 
              placeholder="Ej: Envíos a todo el país"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-tyrell-rose/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark">Botón CTA</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Botón:</span>
              <InlineColorPicker
                value={form.ctaButtonColor}
                onChange={(color) => update("ctaButtonColor", color)}
                label="Color del botón"
              />
              <span className="text-xs text-gray-500">Texto:</span>
              <InlineColorPicker
                value={form.ctaTextColor}
                onChange={(color) => update("ctaTextColor", color)}
                label="Color del texto"
              />
            </div>
          </div>
          
          {/* Button Preview */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs text-gray-500">Vista previa:</span>
            <button
              className="px-6 py-2 text-sm tracking-wider uppercase font-medium"
              style={{ 
                backgroundColor: form.ctaButtonColor || "#daa609", 
                color: form.ctaTextColor || "#FFFFFF" 
              }}
            >
              {form.ctaText || "VER CATÁLOGO"}
            </button>
          </div>

          <Input 
            value={form.ctaText || ""} 
            onChange={e => update("ctaText", e.target.value)} 
            className="rounded-none border-tyrell-rose/20 h-11" 
            placeholder="Ej: VER CATÁLOGO"
          />
        </div>

        <div className="pt-4 border-t border-tyrell-rose/10">
          <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark mb-4">Elementos de Navegación</h3>
          <p className="text-xs text-tyrell-olive/50 mb-3">Los elementos de navegación están vinculados a las secciones de la página</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(form.navItems || []).map((item, i) => (
              <Input
                key={i}
                value={item}
                onChange={e => {
                  const newItems = [...(form.navItems || [])];
                  newItems[i] = e.target.value;
                  update("navItems", newItems);
                }}
                className="rounded-none border-tyrell-rose/20 h-10 text-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminHeaderSection as AdminHeader };
