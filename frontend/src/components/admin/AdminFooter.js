import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Save, Loader2 } from "lucide-react";

export const AdminFooter = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content.footer || {
    tagline: "Donde cada pétalo cuenta una historia de amor",
    copyright: "© 2025 TYRELL Florería. Todos los derechos reservados.",
    madeWithLove: "Hecho con amor en Moyobamba, Perú"
  });

  useEffect(() => { 
    setForm(content.footer || {
      tagline: content.brand?.tagline || "Donde cada pétalo cuenta una historia de amor",
      copyright: "© 2025 TYRELL Florería. Todos los derechos reservados.",
      madeWithLove: "Hecho con amor en Moyobamba, Perú"
    }); 
  }, [content]);

  const handleSave = () => {
    onSave({ ...content, footer: form });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-tyrell-olive font-light">Pie de Página</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 tracking-wider text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      <div className="bg-white border border-tyrell-rose/10 p-6 space-y-5">
        <div>
          <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">Frase del footer</label>
          <Textarea 
            value={form.tagline || ""} 
            onChange={e => update("tagline", e.target.value)} 
            className="rounded-none border-tyrell-rose/20 resize-none" 
            rows={2}
            placeholder="Donde cada pétalo cuenta una historia de amor"
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">Texto de copyright</label>
          <Input 
            value={form.copyright || ""} 
            onChange={e => update("copyright", e.target.value)} 
            className="rounded-none border-tyrell-rose/20 h-11" 
            placeholder="© 2025 TYRELL Florería. Todos los derechos reservados."
          />
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">Texto adicional</label>
          <Input 
            value={form.madeWithLove || ""} 
            onChange={e => update("madeWithLove", e.target.value)} 
            className="rounded-none border-tyrell-rose/20 h-11" 
            placeholder="Hecho con amor en Moyobamba, Perú"
          />
        </div>
      </div>
    </div>
  );
};
