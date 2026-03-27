import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Save, Loader2 } from "lucide-react";
import { InlineColorPicker } from "./InlineColorPicker";

export const AdminServicesSection = ({ content, onSave, saving }) => {
  const [form, setForm] = useState({
    label: content.services?.label || "Nuestros Servicios",
    title: content.services?.title || "Creaciones para cada",
    titleHighlight: content.services?.titleHighlight || "momento",
    subtitle: content.services?.subtitle || "",
    titleColor: content.services?.titleColor || "#1a1a1a",
    highlightColor: content.services?.highlightColor || "#daa609",
    subtitleColor: content.services?.subtitleColor || "#666666",
    labelColor: content.services?.labelColor || "#daa609",
    pedir_buttonColor: content.services?.pedir_buttonColor || "#daa609",
    pedir_textColor: content.services?.pedir_textColor || "#daa609",
  });

  useEffect(() => { 
    if (content.services) {
      setForm({
        ...content.services,
        titleColor: content.services?.titleColor || "#1a1a1a",
        highlightColor: content.services?.highlightColor || "#daa609",
        subtitleColor: content.services?.subtitleColor || "#666666",
        labelColor: content.services?.labelColor || "#daa609",
        pedir_buttonColor: content.services?.pedir_buttonColor || "#daa609",
        pedir_textColor: content.services?.pedir_textColor || "#daa609",
      });
    }
  }, [content]);

  const handleSave = () => {
    onSave({ ...content, services: form });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white border border-tyrell-rose/10 p-6 space-y-5 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-gold">Textos de la sección Productos</h3>
        <Button onClick={handleSave} disabled={saving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-5 tracking-wider text-xs">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
          Guardar
        </Button>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: form.labelColor }}>{form.label}</p>
        <h3 className="font-display text-xl">
          <span style={{ color: form.titleColor }}>{form.title} </span>
          <span style={{ color: form.highlightColor }}>{form.titleHighlight}</span>
        </h3>
        <p className="text-sm mt-1" style={{ color: form.subtitleColor }}>{form.subtitle || "Subtítulo de ejemplo"}</p>
        <div className="mt-3">
          <span className="text-xs text-gray-500 mr-2">Botón "Pedir":</span>
          <button
            className="px-4 py-1 text-xs uppercase tracking-wider"
            style={{ 
              backgroundColor: `${form.pedir_buttonColor}20`,
              color: form.pedir_textColor
            }}
          >
            Pedir
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Label */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs tracking-wider uppercase text-tyrell-olive/50">Etiqueta superior</label>
            <InlineColorPicker
              value={form.labelColor}
              onChange={(color) => update("labelColor", color)}
              label="Color de etiqueta"
            />
          </div>
          <Input value={form.label || ""} onChange={e => update("label", e.target.value)} className="rounded-none border-tyrell-rose/20 h-10 text-sm" />
        </div>

        {/* Title Highlight */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs tracking-wider uppercase text-tyrell-olive/50">Título destacado</label>
            <InlineColorPicker
              value={form.highlightColor}
              onChange={(color) => update("highlightColor", color)}
              label="Color del texto destacado"
            />
          </div>
          <Input value={form.titleHighlight || ""} onChange={e => update("titleHighlight", e.target.value)} className="rounded-none border-tyrell-rose/20 h-10 text-sm" />
        </div>
      </div>

      {/* Main Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs tracking-wider uppercase text-tyrell-olive/50">Título principal</label>
          <InlineColorPicker
            value={form.titleColor}
            onChange={(color) => update("titleColor", color)}
            label="Color del título"
          />
        </div>
        <Input value={form.title || ""} onChange={e => update("title", e.target.value)} className="rounded-none border-tyrell-rose/20 h-10 text-sm" />
      </div>

      {/* Subtitle */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs tracking-wider uppercase text-tyrell-olive/50">Subtítulo</label>
          <InlineColorPicker
            value={form.subtitleColor}
            onChange={(color) => update("subtitleColor", color)}
            label="Color del subtítulo"
          />
        </div>
        <Textarea value={form.subtitle || ""} onChange={e => update("subtitle", e.target.value)} rows={2} className="rounded-none border-tyrell-rose/20 resize-none text-sm" />
      </div>

      {/* Pedir Button Colors */}
      <div className="pt-4 border-t border-tyrell-rose/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-tyrell-rose-dark">Botón "Pedir" de productos</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Fondo:</span>
            <InlineColorPicker
              value={form.pedir_buttonColor}
              onChange={(color) => update("pedir_buttonColor", color)}
              label="Color de fondo del botón"
            />
            <span className="text-xs text-gray-500">Texto:</span>
            <InlineColorPicker
              value={form.pedir_textColor}
              onChange={(color) => update("pedir_textColor", color)}
              label="Color del texto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
