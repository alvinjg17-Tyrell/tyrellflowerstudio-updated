import { useState } from "react";
import { api } from "../../lib/api";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageUploader } from "./ImageUploader";
import { Plus, Trash2, Save, Loader2, GripVertical, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const AdminServices = ({ services, setServices }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "", description: "", image: "", images: [], tag: "", price: "", order: 0,
  });

  const startEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title, description: service.description,
      image: service.image, images: service.images || [],
      tag: service.tag, price: service.price || "", order: service.order,
    });
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveEdit = async () => {
    try {
      setSaving(true);
      const updated = await api.updateService(editingId, form);
      setServices(prev => prev.map(s => s.id === editingId ? updated : s));
      setEditingId(null);
      toast.success("Servicio actualizado");
    } catch (err) {
      toast.error("Error actualizando servicio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    try {
      await api.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Servicio eliminado");
    } catch (err) {
      toast.error("Error eliminando servicio");
    }
  };

  const handleAdd = async () => {
    if (!newForm.title.trim()) { toast.error("El título es obligatorio"); return; }
    try {
      setSaving(true);
      const created = await api.createService({ ...newForm, order: services.length });
      setServices(prev => [...prev, created]);
      setNewForm({ title: "", description: "", image: "", images: [], tag: "", price: "", order: 0 });
      setAdding(false);
      toast.success("Servicio añadido");
    } catch (err) {
      toast.error("Error añadiendo servicio");
    } finally {
      setSaving(false);
    }
  };

  const ServiceForm = ({ formData, setFormData, onSave, onCancel, isSaving, isNew }) => (
    <div className={`${isNew ? "bg-white border-2 border-[#C9A96E]/30" : ""} p-6 space-y-4`}>
      {isNew && <h3 className="text-sm font-medium tracking-wider uppercase text-[#C9A96E]">Nuevo Servicio</h3>}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Título *</label>
          <Input value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="rounded-none border-[#C9A96E]/20 h-11" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Etiqueta</label>
            <Input value={formData.tag} onChange={e => setFormData(p => ({...p, tag: e.target.value}))} className="rounded-none border-[#C9A96E]/20 h-11" placeholder="Popular, etc." />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Precio</label>
            <Input value={formData.price} onChange={e => setFormData(p => ({...p, price: e.target.value}))} className="rounded-none border-[#C9A96E]/20 h-11" placeholder="S/ 50.00" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">Descripción</label>
        <Textarea value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} rows={2} className="rounded-none border-[#C9A96E]/20 resize-none" />
      </div>

      {/* Main image */}
      <ImageUploader
        label="Imagen principal (portada)"
        value={formData.image}
        onChange={(url) => setFormData(p => ({...p, image: url}))}
      />

      {/* Gallery images */}
      <ImageUploader
        label="Galería de imágenes (deslizables)"
        multiple={true}
        images={formData.images || []}
        onImagesChange={(imgs) => setFormData(p => ({...p, images: imgs}))}
      />

      <div className="flex gap-3 pt-2">
        <Button onClick={onSave} disabled={isSaving} className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 text-sm">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Guardar
        </Button>
        <Button onClick={onCancel} variant="outline" className="rounded-none border-[#C9A96E]/20 text-sm">Cancelar</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-['Playfair_Display'] text-2xl text-[#1a1a1a] font-light">Servicios / Productos</h2>
        <Button onClick={() => setAdding(true)} className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 tracking-wider text-sm">
          <Plus className="w-4 h-4 mr-2" /> Añadir Servicio
        </Button>
      </div>

      {adding && (
        <ServiceForm
          formData={newForm}
          setFormData={setNewForm}
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
          isSaving={saving}
          isNew={true}
        />
      )}

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-[#C9A96E]/10 overflow-hidden">
            {editingId === service.id ? (
              <ServiceForm
                formData={form}
                setFormData={setForm}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isSaving={saving}
                isNew={false}
              />
            ) : (
              <div className="flex items-center gap-4 p-4">
                <GripVertical className="w-4 h-4 text-[#1a1a1a]/20 flex-shrink-0" />
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-20 h-20 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 bg-[#faf7f2] flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-6 h-6 text-[#C9A96E]/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-['Playfair_Display'] text-lg text-[#1a1a1a]">{service.title}</h3>
                    {service.tag && <span className="text-[10px] tracking-wider uppercase bg-[#C9A96E]/10 text-[#C9A96E] px-2 py-0.5">{service.tag}</span>}
                    {service.price && <span className="text-sm font-medium text-[#C9A96E]">{service.price}</span>}
                    {(service.images || []).length > 0 && (
                      <span className="text-[10px] tracking-wider uppercase bg-[#1a1a1a]/5 text-[#1a1a1a]/40 px-2 py-0.5">{service.images.length} imgs</span>
                    )}
                  </div>
                  <p className="text-sm text-[#1a1a1a]/40 mt-1 truncate">{service.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(service)} className="text-[#C9A96E] hover:text-[#A67C52] text-xs tracking-wider uppercase transition-colors px-3 py-2">Editar</button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
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
