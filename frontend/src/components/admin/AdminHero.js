import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { ImageUploader } from "./ImageUploader";
import { InlineColorPicker } from "./InlineColorPicker";
import { Save, Loader2, Video, Upload, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminHero = ({ content, onSave, saving }) => {
  const [form, setForm] = useState({
    ...content.hero,
    titleColor: content.hero?.titleColor || "#FFFFFF",
    highlightColor: content.hero?.highlightColor || "#D4B896",
    subtitleColor: content.hero?.subtitleColor || "#FFFFFF",
    ctaButtonColor: content.hero?.ctaButtonColor || "#daa609",
    ctaButtonTextColor: content.hero?.ctaButtonTextColor || "#FFFFFF",
    ctaSecondaryBgColor: content.hero?.ctaSecondaryBgColor || "transparent",
    ctaSecondaryTextColor: content.hero?.ctaSecondaryTextColor || "#FFFFFF",
  });

  useEffect(() => { 
    setForm({
      ...content.hero,
      titleColor: content.hero?.titleColor || "#FFFFFF",
      highlightColor: content.hero?.highlightColor || "#D4B896",
      subtitleColor: content.hero?.subtitleColor || "#FFFFFF",
      ctaButtonColor: content.hero?.ctaButtonColor || "#daa609",
      ctaButtonTextColor: content.hero?.ctaButtonTextColor || "#FFFFFF",
      ctaSecondaryBgColor: content.hero?.ctaSecondaryBgColor || "transparent",
      ctaSecondaryTextColor: content.hero?.ctaSecondaryTextColor || "#FFFFFF",
    }); 
  }, [content]);

  const videoRef = useRef(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      update("video", `${BACKEND_URL}${res.data.url}`);
      toast.success("Video subido correctamente");
    } catch (err) {
      toast.error("Error subiendo video");
    } finally {
      setUploadingVideo(false);
      if (videoRef.current) videoRef.current.value = "";
    }
  };

  const handleSave = () => {
    onSave({ ...content, hero: form });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-tyrell-olive font-light">Sección Hero</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 tracking-wider text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-tyrell-rose/10 p-6 space-y-5">
          {/* Title with color picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs tracking-wider uppercase text-tyrell-olive/50">Título (línea 1)</label>
              <InlineColorPicker
                value={form.titleColor}
                onChange={(color) => update("titleColor", color)}
                label="Color del título"
              />
            </div>
            <Input value={form.title || ""} onChange={e => update("title", e.target.value)} className="rounded-none border-tyrell-rose/20 h-11" />
          </div>

          {/* Highlighted title with color picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs tracking-wider uppercase text-tyrell-olive/50">Título destacado (línea 2)</label>
              <InlineColorPicker
                value={form.highlightColor}
                onChange={(color) => update("highlightColor", color)}
                label="Color del texto destacado"
              />
            </div>
            <Input value={form.titleHighlight || ""} onChange={e => update("titleHighlight", e.target.value)} className="rounded-none border-tyrell-rose/20 h-11" />
          </div>

          {/* Subtitle with color picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs tracking-wider uppercase text-tyrell-olive/50">Subtítulo</label>
              <InlineColorPicker
                value={form.subtitleColor}
                onChange={(color) => update("subtitleColor", color)}
                label="Color del subtítulo"
              />
            </div>
            <Textarea value={form.subtitle || ""} onChange={e => update("subtitle", e.target.value)} rows={3} className="rounded-none border-tyrell-rose/20 resize-none" />
          </div>

          {/* Primary Button */}
          <div className="pt-4 border-t border-tyrell-rose/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-tyrell-rose-dark">Botón Principal</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Fondo:</span>
                <InlineColorPicker
                  value={form.ctaButtonColor}
                  onChange={(color) => update("ctaButtonColor", color)}
                  label="Color del botón"
                />
                <span className="text-xs text-gray-500">Texto:</span>
                <InlineColorPicker
                  value={form.ctaButtonTextColor}
                  onChange={(color) => update("ctaButtonTextColor", color)}
                  label="Color del texto"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-gray-500">Vista previa:</span>
              <button
                className="px-6 py-2 text-sm tracking-wider uppercase"
                style={{ 
                  backgroundColor: form.ctaButtonColor || "#daa609", 
                  color: form.ctaButtonTextColor || "#FFFFFF" 
                }}
              >
                {form.ctaText || "VER CATÁLOGO"}
              </button>
            </div>
            <Input value={form.ctaText || ""} onChange={e => update("ctaText", e.target.value)} className="rounded-none border-tyrell-rose/20 h-11" placeholder="Texto del botón" />
          </div>

          {/* Secondary Button */}
          <div className="pt-4 border-t border-tyrell-rose/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-tyrell-rose-dark">Botón Secundario</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Borde:</span>
                <InlineColorPicker
                  value={form.ctaSecondaryTextColor}
                  onChange={(color) => update("ctaSecondaryTextColor", color)}
                  label="Color del borde/texto"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-gray-500">Vista previa:</span>
              <button
                className="px-6 py-2 text-sm tracking-wider uppercase border-2"
                style={{ 
                  backgroundColor: "transparent", 
                  color: form.ctaSecondaryTextColor || "#FFFFFF",
                  borderColor: form.ctaSecondaryTextColor || "#FFFFFF"
                }}
              >
                {form.ctaSecondaryText || "NUESTROS SERVICIOS"}
              </button>
            </div>
            <Input value={form.ctaSecondaryText || ""} onChange={e => update("ctaSecondaryText", e.target.value)} className="rounded-none border-tyrell-rose/20 h-11" placeholder="Texto del botón secundario" />
          </div>
        </div>

        {/* Media section */}
        <div className="bg-white border border-tyrell-rose/10 p-6 space-y-5">
          {/* Video/Image toggle */}
          <div className="flex items-center justify-between p-4 border border-tyrell-rose/10 bg-tyrell-ivory">
            <div className="flex items-center gap-3">
              {form.useVideo ? <Video className="w-5 h-5 text-tyrell-gold" /> : <ImageIcon className="w-5 h-5 text-tyrell-gold" />}
              <div>
                <span className="text-sm font-medium text-tyrell-dark">
                  {form.useVideo ? "Video de fondo activado" : "Imagen de fondo"}
                </span>
                <p className="text-[11px] text-tyrell-dark/40">Cambia entre video o imagen para el hero</p>
              </div>
            </div>
            <Switch
              checked={form.useVideo || false}
              onCheckedChange={(checked) => update("useVideo", checked)}
            />
          </div>

          <ImageUploader
            label="Imagen de fondo (fallback)"
            value={form.image || ""}
            onChange={(url) => update("image", url)}
          />

          <div>
            <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">Video de fondo</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.video || ""}
                onChange={(e) => update("video", e.target.value)}
                placeholder="URL del video o sube desde tu dispositivo"
                className="flex-1 h-11 border border-tyrell-rose/20 bg-white text-sm px-3 focus:border-tyrell-gold/50 focus:outline-none"
              />
              <button
                onClick={() => videoRef.current?.click()}
                disabled={uploadingVideo}
                className="h-11 px-4 bg-tyrell-gold hover:bg-tyrell-gold-dark text-white text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-2 flex-shrink-0"
              >
                {uploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Subir video
              </button>
            </div>
            <input
              ref={videoRef}
              type="file"
              accept="video/mp4,video/quicktime,video/mov"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-3">Vista previa</label>
            {form.useVideo && form.video ? (
              <video
                src={form.video}
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-48 object-cover bg-tyrell-dark"
              />
            ) : form.image ? (
              <img src={form.image} alt="Hero preview" className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-tyrell-ivory flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-tyrell-gold/30" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
