import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Palette, Check } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

// Predefined color options based on user's palette
const PRESET_COLORS = {
  primary: [
    { name: "Dorado", value: "#daa609" },
    { name: "Dorado Oscuro", value: "#b8890a" },
    { name: "Beige Dorado", value: "#D4B896" },
    { name: "Rosa Viejo", value: "#B76E79" },
    { name: "Verde Oliva", value: "#4F6D5E" },
  ],
  secondary: [
    { name: "Rosa Viejo", value: "#B76E79" },
    { name: "Rosa Empolvado", value: "#D8A7B1" },
    { name: "Nude Durazno", value: "#E8C1B5" },
    { name: "Verde Oliva", value: "#4F6D5E" },
    { name: "Dorado", value: "#daa609" },
  ],
  accent: [
    { name: "Beige Dorado", value: "#D4B896" },
    { name: "Dorado", value: "#daa609" },
    { name: "Rosa Empolvado", value: "#D8A7B1" },
    { name: "Blanco", value: "#FFFFFF" },
  ],
  text: [
    { name: "Negro", value: "#1a1a1a" },
    { name: "Verde Oliva", value: "#4F6D5E" },
    { name: "Gris Oscuro", value: "#333333" },
    { name: "Rosa Viejo", value: "#B76E79" },
  ],
  background: [
    { name: "Marfil Cálido", value: "#F5F1EB" },
    { name: "Blanco", value: "#FFFFFF" },
    { name: "Rosa Claro", value: "#FDF8F8" },
    { name: "Beige Suave", value: "#FAF7F2" },
  ],
};

// Extended color picker with more options
const EXTENDED_COLORS = [
  "#daa609", "#b8890a", "#f5d66e", // Dorados
  "#B76E79", "#D8A7B1", "#E8C1B5", // Rosas
  "#4F6D5E", "#3d5549", "#6b8f7a", // Verdes
  "#D4B896", "#C4A77D", "#E5D4C0", // Beiges
  "#F5F1EB", "#FFFFFF", "#FDF8F8", // Claros
  "#1a1a1a", "#333333", "#666666", // Oscuros
  "#8B4513", "#A0522D", "#CD853F", // Marrones
  "#800020", "#8B0000", "#A52A2A", // Rojos
  "#000080", "#4169E1", "#6495ED", // Azules
  "#006400", "#228B22", "#32CD32", // Verdes vivos
];

const ColorSwatch = ({ color, selected, onClick, size = "md" }) => {
  const sizeClasses = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sizeClasses} rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
        selected ? "border-tyrell-gold ring-2 ring-tyrell-gold/30 scale-110" : "border-gray-200 hover:border-gray-400"
      }`}
      style={{ backgroundColor: color }}
    >
      {selected && <Check className="w-3 h-3 text-white drop-shadow-md" />}
    </button>
  );
};

export const AdminColorPalette = ({ colorPalette, onSave, saving }) => {
  const [palette, setPalette] = useState(colorPalette || {
    primary: "#daa609",
    primaryHover: "#b8890a",
    secondary: "#B76E79",
    accent: "#D4B896",
    text: "#1a1a1a",
    textLight: "#4F6D5E",
    background: "#F5F1EB",
    backgroundAlt: "#FFFFFF",
    rose: "#D8A7B1",
    nude: "#E8C1B5",
  });
  const [expandedSection, setExpandedSection] = useState(null);

  const handleColorChange = (key, value) => {
    setPalette(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await api.updateColorPalette(palette);
      toast.success("Paleta de colores actualizada");
      if (onSave) onSave(palette);
    } catch (err) {
      toast.error("Error actualizando colores");
    }
  };

  const colorFields = [
    { key: "primary", label: "Color Primario (Botones)", presets: PRESET_COLORS.primary },
    { key: "primaryHover", label: "Primario Hover", presets: PRESET_COLORS.primary },
    { key: "secondary", label: "Color Secundario (Header)", presets: PRESET_COLORS.secondary },
    { key: "accent", label: "Color de Acento (Texto destacado)", presets: PRESET_COLORS.accent },
    { key: "text", label: "Color de Texto", presets: PRESET_COLORS.text },
    { key: "textLight", label: "Texto Secundario", presets: PRESET_COLORS.text },
    { key: "background", label: "Fondo Principal", presets: PRESET_COLORS.background },
    { key: "backgroundAlt", label: "Fondo Alternativo", presets: PRESET_COLORS.background },
    { key: "rose", label: "Rosa Empolvado", presets: PRESET_COLORS.secondary },
    { key: "nude", label: "Nude Durazno", presets: PRESET_COLORS.secondary },
  ];

  return (
    <div className="bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-5 h-5 text-tyrell-gold" />
        <h2 className="text-xl font-display text-tyrell-olive tracking-wide">Paleta de Colores</h2>
      </div>

      <p className="text-sm text-tyrell-olive/60 mb-6">
        Personaliza los colores de tu sitio. Los cambios se aplicarán inmediatamente en toda la página.
      </p>

      {/* Preview */}
      <div className="mb-8 p-4 rounded-lg border border-gray-200" style={{ backgroundColor: palette.background }}>
        <p className="text-sm mb-2" style={{ color: palette.textLight }}>Vista previa:</p>
        <h3 className="text-2xl font-display mb-2" style={{ color: palette.text }}>
          Título de <span style={{ color: palette.accent }}>ejemplo</span>
        </h3>
        <p className="text-sm mb-4" style={{ color: palette.textLight }}>Este es un texto de ejemplo para mostrar los colores.</p>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 text-white text-sm transition-colors"
            style={{ backgroundColor: palette.primary }}
          >
            Botón Primario
          </button>
          <button 
            className="px-4 py-2 text-white text-sm"
            style={{ backgroundColor: palette.secondary }}
          >
            Botón Secundario
          </button>
        </div>
      </div>

      {/* Color Fields */}
      <div className="space-y-6">
        {colorFields.map(({ key, label, presets }) => (
          <div key={key} className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-tyrell-olive">{label}</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: palette[key] }}
                />
                <Input
                  type="text"
                  value={palette[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-24 h-8 text-xs font-mono"
                />
              </div>
            </div>
            
            {/* Quick presets */}
            <div className="flex flex-wrap gap-2 mb-2">
              {presets.map((preset) => (
                <ColorSwatch
                  key={preset.value}
                  color={preset.value}
                  selected={palette[key] === preset.value}
                  onClick={() => handleColorChange(key, preset.value)}
                  size="sm"
                />
              ))}
            </div>

            {/* Expand for more colors */}
            <button
              type="button"
              onClick={() => setExpandedSection(expandedSection === key ? null : key)}
              className="text-xs text-tyrell-gold hover:underline"
            >
              {expandedSection === key ? "Menos colores" : "Más colores"}
            </button>

            {expandedSection === key && (
              <div className="mt-3 flex flex-wrap gap-2 p-3 bg-gray-50 rounded">
                {EXTENDED_COLORS.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    selected={palette[key] === color}
                    onClick={() => handleColorChange(key, color)}
                    size="sm"
                  />
                ))}
                <input
                  type="color"
                  value={palette[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-6 h-6 cursor-pointer rounded"
                  title="Color personalizado"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-tyrell-gold hover:bg-tyrell-gold-dark text-white"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Guardar Colores
      </Button>
    </div>
  );
};
