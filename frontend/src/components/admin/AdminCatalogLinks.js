import { useState } from "react";
import { api } from "../../lib/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Trash2, Save, Loader2, Link2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { InlineColorPicker } from "./InlineColorPicker";

export const AdminCatalogLinks = ({ catalogLinks, setCatalogLinks, content, onSave, saving }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [localSaving, setLocalSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", url: "", order: 0 });
  
  // Color form state
  const [colorForm, setColorForm] = useState(content?.catalogColors || {
    labelColor: "#f4c952",
    titleColor: "#1a1a1a",
    highlightColor: "#f4c952",
    buttonBgColor: "#f4c952",
    buttonTextColor: "#FFFFFF",
    lineColor: "#f4c952"
  });

  const startEdit = (link) => {
    setEditingId(link.id);
    setForm({ title: link.title, url: link.url, order: link.order });
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveEdit = async () => {
    try {
      setLocalSaving(true);
      const updated = await api.updateCatalogLink(editingId, form);
      setCatalogLinks(prev => prev.map(l => l.id === editingId ? updated : l));
      setEditingId(null);
      toast.success("Enlace actualizado");
    } catch (err) {
      toast.error("Error actualizando enlace");
    } finally {
      setLocalSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este enlace?")) return;
    try {
      await api.deleteCatalogLink(id);
      setCatalogLinks(prev => prev.filter(l => l.id !== id));
      toast.success("Enlace eliminado");
    } catch (err) {
      toast.error("Error eliminando enlace");
    }
  };

  const handleAdd = async () => {
    if (!newForm.title.trim() || !newForm.url.trim()) {
      toast.error("Título y URL son obligatorios"); return;
    }
    try {
      setLocalSaving(true);
      const created = await api.createCatalogLink({ ...newForm, order: catalogLinks.length });
      setCatalogLinks(prev => [...prev, created]);
      setNewForm({ title: "", url: "", order: 0 });
      setAdding(false);
      toast.success("Enlace añadido");
    } catch (err) {
      toast.error("Error añadiendo enlace");
    } finally {
      setLocalSaving(false);
    }
  };

  const handleSaveColors = () => {
    onSave({ ...content, catalogColors: colorForm });
  };

  const updateColor = (field, value) => setColorForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-8">
      {/* Color Settings */}
      <div className="bg-white border border-tyrell-gold/20 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-tyrell-dark">Colores de la Sección</h3>
          <Button onClick={handleSaveColors} disabled={saving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-5 text-xs tracking-wider">
            {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
            Guardar Colores
          </Button>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-b from-white via-tyrell-rose-light/15 to-white p-6 rounded mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-[1px] w-10" style={{ backgroundColor: `${colorForm.lineColor}66` }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: colorForm.labelColor }}>Nuestros Catálogos</span>
              <div className="h-[1px] w-10" style={{ backgroundColor: `${colorForm.lineColor}66` }} />
            </div>
            <h2 className="font-display text-2xl mb-4" style={{ color: colorForm.titleColor }}>
              Explora nuestras <span style={{ color: colorForm.highlightColor }}>colecciones</span>
            </h2>
            <button 
              className="px-6 py-3 text-xs tracking-wider uppercase"
              style={{ backgroundColor: colorForm.buttonBgColor, color: colorForm.buttonTextColor }}
            >
              CATÁLOGO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InlineColorPicker label="Etiqueta" value={colorForm.labelColor} onChange={(v) => updateColor("labelColor", v)} />
          <InlineColorPicker label="Título" value={colorForm.titleColor} onChange={(v) => updateColor("titleColor", v)} />
          <InlineColorPicker label="Destacado" value={colorForm.highlightColor} onChange={(v) => updateColor("highlightColor", v)} />
          <InlineColorPicker label="Botón Fondo" value={colorForm.buttonBgColor} onChange={(v) => updateColor("buttonBgColor", v)} />
          <InlineColorPicker label="Botón Texto" value={colorForm.buttonTextColor} onChange={(v) => updateColor("buttonTextColor", v)} />
          <InlineColorPicker label="Líneas" value={colorForm.lineColor} onChange={(v) => updateColor("lineColor", v)} />
        </div>
      </div>

      {/* Links Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-tyrell-dark font-light">Enlaces de Catálogo</h2>
          <Button onClick={() => setAdding(true)} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 tracking-wider text-sm">
            <Plus className="w-4 h-4 mr-2" /> Añadir Enlace
          </Button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Estos enlaces se muestran como botones en la página para que tus clientes accedan a tus catálogos.</p>

        {adding && (
          <div className="bg-white border-2 border-tyrell-gold/30 p-6 space-y-4 mb-4">
            <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-gold">Nuevo Enlace</h3>
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">Nombre del botón *</label>
              <Input value={newForm.title} onChange={e => setNewForm(p => ({...p, title: e.target.value}))} className="rounded-none border-tyrell-gold/20 h-11" placeholder="Ej: Catálogo San Valentín" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">URL del enlace *</label>
              <Input value={newForm.url} onChange={e => setNewForm(p => ({...p, url: e.target.value}))} className="rounded-none border-tyrell-gold/20 h-11" placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleAdd} disabled={localSaving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 text-sm">
                {localSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Guardar
              </Button>
              <Button onClick={() => setAdding(false)} variant="outline" className="rounded-none border-tyrell-gold/20 text-sm">Cancelar</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {catalogLinks.map((link) => (
            <div key={link.id} className="bg-white border border-tyrell-gold/10 p-5">
              {editingId === link.id ? (
                <div className="space-y-4">
                  <Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Nombre del botón" className="rounded-none border-tyrell-gold/20 h-11" />
                  <Input value={form.url} onChange={e => setForm(p => ({...p, url: e.target.value}))} placeholder="URL" className="rounded-none border-tyrell-gold/20 h-11" />
                  <div className="flex gap-3">
                    <Button onClick={saveEdit} disabled={localSaving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 text-sm">
                      {localSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Guardar
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" className="rounded-none border-tyrell-gold/20 text-sm">Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Link2 className="w-5 h-5 text-tyrell-gold flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-display text-base text-tyrell-dark">{link.title}</span>
                      <p className="text-xs text-gray-400 truncate">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-tyrell-gold transition-colors p-2">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => startEdit(link)} className="text-tyrell-gold hover:text-tyrell-gold-dark text-xs tracking-wider uppercase transition-colors px-3 py-2">Editar</button>
                    <button onClick={() => handleDelete(link.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
