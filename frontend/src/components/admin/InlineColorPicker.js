import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";

// Preset colors based on TYRELL palette
const PRESET_COLORS = [
  "#daa609", "#b8890a", "#D4B896", // Dorados
  "#B76E79", "#D8A7B1", "#E8C1B5", // Rosas
  "#4F6D5E", "#3d5549", "#6b8f7a", // Verdes
  "#1a1a1a", "#333333", "#666666", // Oscuros
  "#F5F1EB", "#FFFFFF", "#FDF8F8", // Claros
  "#800020", "#8B0000", "#A52A2A", // Rojos
];

export const InlineColorPicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded border border-gray-200 hover:border-tyrell-gold transition-colors bg-white"
        title={label || "Cambiar color"}
      >
        <div 
          className="w-5 h-5 rounded border border-gray-300"
          style={{ backgroundColor: value || "#daa609" }}
        />
        <Palette className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[200px]">
          <p className="text-xs text-gray-500 mb-2">{label || "Seleccionar color"}</p>
          
          {/* Preset colors */}
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => { onChange(color); setIsOpen(false); }}
                className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                  value === color ? "border-tyrell-gold ring-2 ring-tyrell-gold/30" : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Custom color input */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <input
              type="color"
              value={value || "#daa609"}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || "#daa609"}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-2 py-1 text-xs font-mono border border-gray-200 rounded"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
};
