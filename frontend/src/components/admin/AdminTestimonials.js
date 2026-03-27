import { useState } from "react";
import { api } from "../../lib/api";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, Trash2, Save, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

export const AdminTestimonials = ({ testimonials, setTestimonials }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", text: "", rating: 5 });

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({ name: t.name, text: t.text, rating: t.rating });
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveEdit = async () => {
    try {
      setSaving(true);
      const updated = await api.updateTestimonial(editingId, form);
      setTestimonials(prev => prev.map(t => t.id === editingId ? updated : t));
      setEditingId(null);
      toast.success("Testimonio actualizado");
    } catch (err) {
      toast.error("Error actualizando testimonio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este testimonio?")) return;
    try {
      await api.deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success("Testimonio eliminado");
    } catch (err) {
      toast.error("Error eliminando testimonio");
    }
  };

  const handleAdd = async () => {
    if (!newForm.name.trim() || !newForm.text.trim()) {
      toast.error("Nombre y texto son obligatorios"); return;
    }
    try {
      setSaving(true);
      const created = await api.createTestimonial(newForm);
      setTestimonials(prev => [created, ...prev]);
      setNewForm({ name: "", text: "", rating: 5 });
      setAdding(false);
      toast.success("Testimonio añadido");
    } catch (err) {
      toast.error("Error añadiendo testimonio");
    } finally {
      setSaving(false);
    }
  };

  const RatingStars = ({ rating, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}>
          <Star className={`w-5 h-5 transition-colors ${
            star <= rating ? "text-[#C9A96E] fill-[#C9A96E]" : "text-[#C9A96E]/20"
          }`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-['Playfair_Display'] text-2xl text-[#1a1a1a] font-light">Testimonios</h2>
        <Button onClick={() => setAdding(true)} className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 tracking-wider text-sm">
          <Plus className="w-4 h-4 mr-2" /> Añadir
        </Button>
      </div>

      {adding && (
        <div className="bg-white border-2 border-[#C9A96E]/30 p-6 space-y-4">
          <h3 className="text-sm font-medium tracking-wider uppercase text-[#C9A96E]">Nuevo Testimonio</h3>
          <Input value={newForm.name} onChange={e => setNewForm(p => ({...p, name: e.target.value}))} placeholder="Nombre del cliente" className="rounded-none border-[#C9A96E]/20 h-11" />
          <Textarea value={newForm.text} onChange={e => setNewForm(p => ({...p, text: e.target.value}))} placeholder="Testimonio..." rows={3} className="rounded-none border-[#C9A96E]/20 resize-none" />
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-2">Valoración</label>
            <RatingStars rating={newForm.rating} onChange={r => setNewForm(p => ({...p, rating: r}))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleAdd} disabled={saving} className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 text-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Guardar
            </Button>
            <Button onClick={() => setAdding(false)} variant="outline" className="rounded-none border-[#C9A96E]/20 text-sm">Cancelar</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border border-[#C9A96E]/10 p-5">
            {editingId === t.id ? (
              <div className="space-y-4">
                <Input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="rounded-none border-[#C9A96E]/20 h-11" />
                <Textarea value={form.text} onChange={e => setForm(p => ({...p, text: e.target.value}))} rows={3} className="rounded-none border-[#C9A96E]/20 resize-none" />
                <RatingStars rating={form.rating} onChange={r => setForm(p => ({...p, rating: r}))} />
                <div className="flex gap-3">
                  <Button onClick={saveEdit} disabled={saving} className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 text-sm">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Guardar
                  </Button>
                  <Button onClick={cancelEdit} variant="outline" className="rounded-none border-[#C9A96E]/20 text-sm">Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-['Playfair_Display'] text-base text-[#1a1a1a]">{t.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#C9A96E] fill-[#C9A96E]" />)}
                    </div>
                  </div>
                  <p className="text-sm text-[#1a1a1a]/50 italic">“{t.text}”</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(t)} className="text-[#C9A96E] hover:text-[#A67C52] text-xs tracking-wider uppercase transition-colors px-3 py-2">Editar</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
