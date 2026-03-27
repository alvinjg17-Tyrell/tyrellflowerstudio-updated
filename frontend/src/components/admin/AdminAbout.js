import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageUploader } from "./ImageUploader";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

export const AdminAbout = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content.about);

  useEffect(() => { setForm(content.about); }, [content]);

  const handleSave = () => {
    onSave({ ...content, about: form });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const updateFeature = (index, field, value) => {
    const updated = [...(form.features || [])];
    updated[index] = { ...updated[index], [field]: value };
    setForm(prev => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setForm(prev => ({
      ...prev,
      features: [...(prev.features || []), { title: "", description: "", icon: "Flower2" }],
    }));
  };

  const removeFeature = (index) => {
    setForm(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const iconOptions = ["Flower2", "Sparkles", "Clock", "Heart", "Star", "Gift", "Truck", "Shield", "Award", "Leaf"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-['Playfair_Display'] text-2xl text-[#1a1a1a] font-light">Sección Nosotros</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 tracking-wider text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#C9A96E]/10 p-6 space-y-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Etiqueta superior</label>
            <Input value={form.label || ""} onChange={e => update("label", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Título</label>
            <Input value={form.title || ""} onChange={e => update("title", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Subtítulo</label>
            <Input value={form.subtitle || ""} onChange={e => update("subtitle", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Descripción</label>
            <Textarea value={form.description || ""} onChange={e => update("description", e.target.value)} rows={4} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Número del badge</label>
              <Input value={form.badgeNumber || ""} onChange={e => update("badgeNumber", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" placeholder="+2000" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Texto del badge</label>
              <Input value={form.badgeLabel || ""} onChange={e => update("badgeLabel", e.target.value)} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11" placeholder="Arreglos Entregados" />
            </div>
          </div>
          <ImageUploader
            label="Imagen de la sección"
            value={form.image || ""}
            onChange={(url) => update("image", url)}
          />
        </div>

        <div className="bg-white border border-[#C9A96E]/10 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs tracking-wider uppercase text-[#1a1a1a]/50">Características</label>
            <button onClick={addFeature} className="flex items-center gap-1 text-[#C9A96E] hover:text-[#A67C52] text-xs tracking-wider transition-colors">
              <Plus className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>
          {(form.features || []).map((feat, i) => (
            <div key={i} className="border border-[#C9A96E]/10 p-4 space-y-3 relative">
              <button onClick={() => removeFeature(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <Input value={feat.title} onChange={e => updateFeature(i, "title", e.target.value)} placeholder="Título" className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-10 text-sm" />
              <Textarea value={feat.description} onChange={e => updateFeature(i, "description", e.target.value)} placeholder="Descripción" rows={2} className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 resize-none text-sm" />
              <select value={feat.icon} onChange={e => updateFeature(i, "icon", e.target.value)} className="w-full h-10 border border-[#C9A96E]/20 bg-white text-sm px-3 focus:border-[#C9A96E]/50 focus:outline-none">
                {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
