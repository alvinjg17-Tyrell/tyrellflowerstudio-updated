import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Save, Loader2 } from "lucide-react";

export const AdminBrand = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content.brand);

  useEffect(() => { setForm(content.brand); }, [content]);

  const handleSave = () => {
    onSave({ ...content, brand: form });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-['Playfair_Display'] text-2xl text-[#1a1a1a] font-light">Información de Marca</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 tracking-wider text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      <div className="bg-white border border-[#C9A96E]/10 p-6 space-y-5">
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Nombre del negocio</label>
          <Input value={form.name || ""} onChange={e => update("name", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Frase/Tagline</label>
          <Input value={form.tagline || ""} onChange={e => update("tagline", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Descripción del negocio</label>
          <Textarea value={form.description || ""} onChange={e => update("description", e.target.value)} rows={3} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 resize-none" />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">URL del Catálogo principal</label>
            <Input value={form.catalogUrl || ""} onChange={e => update("catalogUrl", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Ubicación (texto)</label>
            <Input value={form.location || ""} onChange={e => update("location", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" />
          </div>
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Enlace Google Maps (ubicación)</label>
          <Input value={form.locationUrl || ""} onChange={e => update("locationUrl", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" placeholder="https://www.google.com/maps/..." />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Enlace WhatsApp</label>
            <Input value={form.whatsappLink || ""} onChange={e => update("whatsappLink", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" placeholder="https://wa.me/51..." />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Número WhatsApp (visible)</label>
            <Input value={form.whatsappNumber || ""} onChange={e => update("whatsappNumber", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" placeholder="+51 ..." />
          </div>
        </div>
      </div>
    </div>
  );
};
