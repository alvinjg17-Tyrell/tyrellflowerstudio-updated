import { useState, useRef } from "react";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = "https://tyrellflowerstudio-updated-production.up.railway.app";

export const ImageUploader = ({ value, onChange, label, multiple = false, images = [], onImagesChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const fullUrl = `${BACKEND_URL}${res.data.url}`;
        uploadedUrls.push(fullUrl);
      }

      if (multiple && onImagesChange) {
        onImagesChange([...images, ...uploadedUrls]);
      } else if (onChange) {
        onChange(uploadedUrls[0]);
      }
      toast.success(`${uploadedUrls.length} imagen(es) subida(s)`);
    } catch (err) {
      toast.error("Error subiendo imagen");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    if (onImagesChange) {
      onImagesChange(images.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50">{label}</label>
      )}

      {/* Single image mode */}
      {!multiple && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange && onChange(e.target.value)}
              placeholder="URL de imagen o sube desde tu dispositivo"
              className="flex-1 h-11 border border-[#C9A96E]/20 bg-white text-sm px-3 focus:border-[#C9A96E]/50 focus:outline-none"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="h-11 px-4 bg-[#C9A96E] hover:bg-[#A67C52] text-white text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-2 flex-shrink-0"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Subir
            </button>
          </div>
          {value && (
            <img src={value} alt="Preview" className="w-full h-32 object-cover" />
          )}
        </div>
      )}

      {/* Multiple images mode */}
      {multiple && (
        <div className="space-y-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full h-20 border-2 border-dashed border-[#C9A96E]/25 hover:border-[#C9A96E]/50 flex items-center justify-center gap-3 text-[#C9A96E]/60 hover:text-[#C9A96E] transition-all duration-300 bg-[#faf7f2]"
          >
            {uploading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> <span className="text-sm">Subiendo...</span></>
            ) : (
              <><Upload className="w-5 h-5" /> <span className="text-sm tracking-wider">Subir imágenes desde tu dispositivo</span></>
            )}
          </button>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-20 object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};
