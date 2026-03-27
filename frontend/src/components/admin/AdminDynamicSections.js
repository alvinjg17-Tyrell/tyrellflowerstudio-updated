import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit2, Image, LayoutGrid, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";

const SECTION_TYPES = [
  { value: "banner", label: "Banner Promocional", icon: "🎯" },
  { value: "gallery", label: "Galería de Imágenes", icon: "🖼️" },
  { value: "text", label: "Texto con Imagen", icon: "📝" },
  { value: "promo", label: "Promoción Especial", icon: "🏷️" },
];

export const AdminDynamicSections = ({ sections, setSections }) => {
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    type: "banner",
    content: "",
    image: "",
    images: [],
    buttonText: "",
    buttonLink: "",
    backgroundColor: "#F5F1EB",
    textColor: "#1a1a1a",
    order: 0,
    active: true,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      const result = await api.uploadFile(file);
      const imageUrl = `${process.env.REACT_APP_BACKEND_URL}${result.url}`;
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast.success("Imagen subida");
    } catch (err) {
      toast.error("Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("El título es requerido");
      return;
    }

    try {
      setLoading(true);
      if (editingSection) {
        const updated = await api.updateDynamicSection(editingSection.id, formData);
        setSections(prev => prev.map(s => s.id === editingSection.id ? updated : s));
        toast.success("Sección actualizada");
      } else {
        const newSection = await api.createDynamicSection({
          ...formData,
          order: sections.length,
        });
        setSections(prev => [...prev, newSection]);
        toast.success("Sección creada");
      }
      resetForm();
    } catch (err) {
      toast.error("Error guardando sección");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta sección?")) return;
    try {
      await api.deleteDynamicSection(id);
      setSections(prev => prev.filter(s => s.id !== id));
      toast.success("Sección eliminada");
    } catch (err) {
      toast.error("Error eliminando sección");
    }
  };

  const toggleActive = async (section) => {
    try {
      const updated = await api.updateDynamicSection(section.id, {
        ...section,
        active: !section.active,
      });
      setSections(prev => prev.map(s => s.id === section.id ? updated : s));
      toast.success(updated.active ? "Sección activada" : "Sección desactivada");
    } catch (err) {
      toast.error("Error actualizando sección");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      type: "banner",
      content: "",
      image: "",
      images: [],
      buttonText: "",
      buttonLink: "",
      backgroundColor: "#F5F1EB",
      textColor: "#1a1a1a",
      order: 0,
      active: true,
    });
    setEditingSection(null);
    setShowForm(false);
  };

  const startEdit = (section) => {
    setFormData({
      title: section.title || "",
      subtitle: section.subtitle || "",
      type: section.type || "banner",
      content: section.content || "",
      image: section.image || "",
      images: section.images || [],
      buttonText: section.buttonText || "",
      buttonLink: section.buttonLink || "",
      backgroundColor: section.backgroundColor || "#F5F1EB",
      textColor: section.textColor || "#1a1a1a",
      order: section.order || 0,
      active: section.active !== false,
    });
    setEditingSection(section);
    setShowForm(true);
  };

  return (
    <div className="bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-tyrell-gold" />
          <h2 className="text-xl font-display text-tyrell-olive tracking-wide">Secciones Dinámicas</h2>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Nueva Sección
        </Button>
      </div>

      <p className="text-sm text-tyrell-olive/60 mb-6">
        Agrega secciones personalizadas para promociones, campañas o contenido especial.
      </p>

      {/* Section List */}
      {sections.length > 0 ? (
        <div className="space-y-3 mb-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`p-4 border rounded-lg flex items-center justify-between ${
                section.active ? "border-tyrell-gold/30 bg-tyrell-ivory/50" : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                {section.image && (
                  <img src={section.image} alt="" className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h4 className="font-medium text-tyrell-olive">{section.title}</h4>
                  <p className="text-xs text-gray-500">
                    {SECTION_TYPES.find(t => t.value === section.type)?.label || section.type}
                    {!section.active && " • Inactiva"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(section)}
                  className={`p-2 rounded transition-colors ${
                    section.active ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title={section.active ? "Desactivar" : "Activar"}
                >
                  {section.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => startEdit(section)}
                  className="p-2 text-tyrell-gold hover:bg-tyrell-gold/10 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg mb-6">
          <LayoutGrid className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay secciones dinámicas</p>
          <p className="text-xs">Crea tu primera sección para promociones o campañas</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="border-t pt-6">
          <h3 className="font-medium text-tyrell-olive mb-4">
            {editingSection ? "Editar Sección" : "Nueva Sección"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Tipo de Sección</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full h-10 px-3 border border-gray-200 rounded text-sm"
                >
                  {SECTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título de la sección"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Subtítulo</label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Subtítulo opcional"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Contenido</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Texto de la sección..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Imagen</label>
              <div className="flex gap-3 items-center">
                {formData.image && (
                  <img src={formData.image} alt="" className="w-20 h-20 object-cover rounded border" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 border border-dashed rounded cursor-pointer hover:bg-gray-50">
                  <Image className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Subir imagen</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Texto del Botón</label>
                <Input
                  value={formData.buttonText}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Ver más"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Enlace del Botón</label>
                <Input
                  value={formData.buttonLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Color de Fondo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase text-tyrell-olive/70 mb-1">Color de Texto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={formData.textColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="border rounded-lg overflow-hidden">
              <p className="text-xs text-gray-500 px-3 py-2 bg-gray-50">Vista previa</p>
              <div 
                className="p-6 text-center"
                style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}
              >
                <h4 className="text-xl font-display mb-1">{formData.title || "Título"}</h4>
                {formData.subtitle && <p className="text-sm opacity-70 mb-2">{formData.subtitle}</p>}
                {formData.content && <p className="text-sm mb-4">{formData.content}</p>}
                {formData.buttonText && (
                  <button className="px-4 py-2 bg-tyrell-gold text-white text-sm">
                    {formData.buttonText}
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingSection ? "Guardar Cambios" : "Crear Sección"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
