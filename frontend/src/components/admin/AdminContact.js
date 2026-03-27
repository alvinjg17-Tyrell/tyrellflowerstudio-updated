import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Save, Loader2 } from "lucide-react";
import { InlineColorPicker } from "./InlineColorPicker";
import { Switch } from "../ui/switch";

export const AdminContact = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content.contact || {});
  const [colorForm, setColorForm] = useState(content.contactColors || {
    bgColor: "#4F6D5E",
    labelColor: "#f4c952",
    titleColor: "#FFFFFF",
    subtitleColor: "#FFFFFF99",
    buttonBgColor: "#f4c952",
    buttonTextColor: "#FFFFFF",
    inputBorderColor: "#f4c952"
  });

  useEffect(() => { 
    setForm(content.contact || {}); 
    setColorForm(content.contactColors || {
      bgColor: "#4F6D5E",
      labelColor: "#f4c952",
      titleColor: "#FFFFFF",
      subtitleColor: "#FFFFFF99",
      buttonBgColor: "#f4c952",
      buttonTextColor: "#FFFFFF",
      inputBorderColor: "#f4c952"
    });
  }, [content]);

  const handleSave = () => {
    onSave({ ...content, contact: form, contactColors: colorForm });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateColor = (field, value) => setColorForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-tyrell-dark font-light">Sección Contacto</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 tracking-wider text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      {/* Color Settings */}
      <div className="bg-white border border-tyrell-gold/20 p-6 rounded-lg">
        <h3 className="font-display text-lg text-tyrell-dark mb-4">Colores de la Sección</h3>

        {/* Preview */}
        <div className="p-6 rounded mb-4" style={{ backgroundColor: colorForm.bgColor }}>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-[1px] w-10" style={{ backgroundColor: `${colorForm.labelColor}66` }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorForm.labelColor }}>Contacto</span>
              <div className="h-[1px] w-10" style={{ backgroundColor: `${colorForm.labelColor}66` }} />
            </div>
            <h2 className="font-display text-xl" style={{ color: colorForm.titleColor }}>Contáctanos</h2>
            <p className="text-sm mt-1" style={{ color: colorForm.subtitleColor }}>Estamos aquí para ti</p>
          </div>
          <div className="max-w-xs mx-auto">
            <div 
              className="h-10 rounded-none mb-2 border"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: `${colorForm.inputBorderColor}4D`
              }}
            />
            <button 
              className="w-full py-2 text-xs tracking-wider uppercase"
              style={{ backgroundColor: colorForm.buttonBgColor, color: colorForm.buttonTextColor }}
            >
              ENVIAR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InlineColorPicker label="Fondo" value={colorForm.bgColor} onChange={(v) => updateColor("bgColor", v)} />
          <InlineColorPicker label="Etiqueta" value={colorForm.labelColor} onChange={(v) => updateColor("labelColor", v)} />
          <InlineColorPicker label="Título" value={colorForm.titleColor} onChange={(v) => updateColor("titleColor", v)} />
          <InlineColorPicker label="Subtítulo" value={colorForm.subtitleColor} onChange={(v) => updateColor("subtitleColor", v)} />
          <InlineColorPicker label="Botón Fondo" value={colorForm.buttonBgColor} onChange={(v) => updateColor("buttonBgColor", v)} />
          <InlineColorPicker label="Botón Texto" value={colorForm.buttonTextColor} onChange={(v) => updateColor("buttonTextColor", v)} />
          <InlineColorPicker label="Borde Inputs" value={colorForm.inputBorderColor} onChange={(v) => updateColor("inputBorderColor", v)} />
        </div>
      </div>

      {/* Content Settings */}
      <div className="bg-white border border-tyrell-gold/10 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Título de la sección</label>
            <Input value={form.title || ""} onChange={e => update("title", e.target.value)} className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Subtítulo</label>
            <Input value={form.subtitle || ""} onChange={e => update("subtitle", e.target.value)} className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11" />
          </div>
        </div>

        {/* Location toggle */}
        <div className="flex items-center justify-between p-4 bg-tyrell-ivory rounded">
          <div>
            <label className="block text-sm font-medium text-tyrell-dark">Mostrar Ubicación</label>
            <p className="text-xs text-gray-500 mt-0.5">Activa o desactiva la sección de ubicación</p>
          </div>
          <Switch
            checked={form.showLocation !== false}
            onCheckedChange={(checked) => update("showLocation", checked)}
          />
        </div>

        {form.showLocation !== false && (
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Dirección</label>
            <Input value={form.address || ""} onChange={e => update("address", e.target.value)} className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11" />
          </div>
        )}

        <div>
          <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Etiqueta de WhatsApp</label>
          <Input value={form.whatsappLabel || ""} onChange={e => update("whatsappLabel", e.target.value)} className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11" />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Título de horario</label>
            <Input value={form.scheduleTitle || ""} onChange={e => update("scheduleTitle", e.target.value)} className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Horario (L-S)</label>
            <Input value={form.schedule || ""} onChange={e => update("schedule", e.target.value)} className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11" />
          </div>
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Horario (Domingos)</label>
          <Input value={form.scheduleWeekend || ""} onChange={e => update("scheduleWeekend", e.target.value)} className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11" />
        </div>
      </div>
    </div>
  );
};
