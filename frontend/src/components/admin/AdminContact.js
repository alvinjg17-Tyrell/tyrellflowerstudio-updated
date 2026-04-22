import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Save, Loader2, Plus, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { InlineColorPicker } from "./InlineColorPicker";
import { Switch } from "../ui/switch";
import { ImageUploader } from "./ImageUploader";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const defaultBlock = (index = 0) => ({
  id: `contact-block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type: "text",
  title: "",
  subtitle: "",
  content: "",
  image: "",
  video: "",
  backgroundColor: "#FFFFFF",
  textColor: "#1a1a1a",
  visible: true,
  order: index,
});

const normalizeBlocks = (blocks = []) =>
  (blocks || []).map((block, index) => ({
    id: block.id || `contact-block-${index}`,
    type: block.type || "text",
    title: block.title || "",
    subtitle: block.subtitle || "",
    content: block.content || "",
    image: block.image || "",
    video: block.video || "",
    backgroundColor: block.backgroundColor || "#FFFFFF",
    textColor: block.textColor || "#1a1a1a",
    visible: block.visible !== false,
    order: typeof block.order === "number" ? block.order : index,
  }));

const BLOCK_TYPES = [
  { value: "text", label: "Texto" },
  { value: "image_text", label: "Imagen + texto" },
  { value: "gallery", label: "Galería" },
  { value: "video", label: "Video" },
  { value: "cta", label: "Llamado a la acción" },
];

const SortableBlock = ({ block, onUpdate, onDelete, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const [expanded, setExpanded] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const updateField = (field, value) => {
    onUpdate({ ...block, [field]: value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg bg-white ${
        isDragging ? "shadow-lg border-tyrell-gold" : "border-tyrell-gold/10"
      }`}
    >
      <div className="flex items-center gap-3 p-4 border-b border-tyrell-gold/10">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded touch-none"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-tyrell-gold" />
          ) : (
            <ChevronDown className="w-4 h-4 text-tyrell-gold" />
          )}
          <div>
            <p className="text-sm font-medium text-tyrell-dark">
              {block.title || "Bloque sin título"}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {BLOCK_TYPES.find((t) => t.value === block.type)?.label || block.type}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onToggle}
          className={`p-2 rounded transition-colors ${
            block.visible
              ? "text-tyrell-gold hover:bg-tyrell-gold/10"
              : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
                Tipo de bloque
              </label>
              <select
                value={block.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full h-11 border border-tyrell-gold/20 bg-white text-sm px-3 focus:border-tyrell-gold/50 focus:outline-none"
              >
                {BLOCK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
                Título
              </label>
              <Input
                value={block.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
              Subtítulo
            </label>
            <Input
              value={block.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
              Contenido
            </label>
            <Textarea
              value={block.content}
              onChange={(e) => updateField("content", e.target.value)}
              rows={4}
              className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ImageUploader
              label="Imagen del bloque"
              value={block.image || ""}
              onChange={(url) => updateField("image", url)}
            />

            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
                URL de video
              </label>
              <Input
                value={block.video}
                onChange={(e) => updateField("video", e.target.value)}
                placeholder="https://..."
                className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
                Color de fondo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.backgroundColor || "#FFFFFF"}
                  onChange={(e) => updateField("backgroundColor", e.target.value)}
                  className="w-12 h-11 border border-tyrell-gold/20"
                />
                <Input
                  value={block.backgroundColor || "#FFFFFF"}
                  onChange={(e) => updateField("backgroundColor", e.target.value)}
                  className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
                Color de texto
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.textColor || "#1a1a1a"}
                  onChange={(e) => updateField("textColor", e.target.value)}
                  className="w-12 h-11 border border-tyrell-gold/20"
                />
                <Input
                  value={block.textColor || "#1a1a1a"}
                  onChange={(e) => updateField("textColor", e.target.value)}
                  className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
                />
              </div>
            </div>
          </div>

          <div className="border border-tyrell-gold/10">
            <div className="px-3 py-2 text-xs uppercase tracking-wider text-gray-500 border-b border-tyrell-gold/10">
              Vista previa
            </div>
            <div
              className="p-6"
              style={{
                backgroundColor: block.backgroundColor || "#FFFFFF",
                color: block.textColor || "#1a1a1a",
              }}
            >
              {block.subtitle && (
                <p className="text-xs uppercase tracking-[0.24em] mb-3 opacity-70">
                  {block.subtitle}
                </p>
              )}
              <h4 className="text-2xl font-display mb-3">
                {block.title || "Título del bloque"}
              </h4>
              {block.content && (
                <p className="text-sm leading-6 opacity-80 whitespace-pre-line">
                  {block.content}
                </p>
              )}
              {block.image && (
                <img
                  src={block.image}
                  alt=""
                  className="mt-4 w-full max-w-xs h-auto object-cover"
                />
              )}
              {block.video && <p className="mt-4 text-xs opacity-70">Video agregado</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminContact = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content.contact || {});
  const [colorForm, setColorForm] = useState(
    content.contactColors || {
      bgColor: "#4F6D5E",
      labelColor: "#f4c952",
      titleColor: "#FFFFFF",
      subtitleColor: "#FFFFFF99",
      buttonBgColor: "#f4c952",
      buttonTextColor: "#FFFFFF",
      inputBorderColor: "#f4c952",
    }
  );

  useEffect(() => {
    setForm({
      ...(content.contact || {}),
      blocks: normalizeBlocks(content.contact?.blocks || []),
    });
    setColorForm(
      content.contactColors || {
        bgColor: "#4F6D5E",
        labelColor: "#f4c952",
        titleColor: "#FFFFFF",
        subtitleColor: "#FFFFFF99",
        buttonBgColor: "#f4c952",
        buttonTextColor: "#FFFFFF",
        inputBorderColor: "#f4c952",
      }
    );
  }, [content]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSave = () => {
    onSave({
      ...content,
      contact: {
        ...form,
        blocks: normalizeBlocks(form.blocks || []).map((block, index) => ({
          ...block,
          order: index,
        })),
      },
      contactColors: colorForm,
    });
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateColor = (field, value) =>
    setColorForm((prev) => ({ ...prev, [field]: value }));

  const addBlock = () => {
    const nextBlocks = [...(form.blocks || [])];
    nextBlocks.push(defaultBlock(nextBlocks.length));
    setForm((prev) => ({
      ...prev,
      blocks: nextBlocks.map((block, index) => ({ ...block, order: index })),
    }));
  };

  const updateBlock = (index, updatedBlock) => {
    const nextBlocks = [...(form.blocks || [])];
    nextBlocks[index] = updatedBlock;
    setForm((prev) => ({
      ...prev,
      blocks: nextBlocks,
    }));
  };

  const removeBlock = (index) => {
    setForm((prev) => ({
      ...prev,
      blocks: (prev.blocks || [])
        .filter((_, i) => i !== index)
        .map((block, i) => ({ ...block, order: i })),
    }));
  };

  const toggleBlockVisibility = (index) => {
    setForm((prev) => ({
      ...prev,
      blocks: (prev.blocks || []).map((block, i) =>
        i === index ? { ...block, visible: !block.visible } : block
      ),
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = (form.blocks || []).findIndex((b) => b.id === active.id);
    const newIndex = (form.blocks || []).findIndex((b) => b.id === over.id);

    const reordered = arrayMove(form.blocks || [], oldIndex, newIndex).map(
      (block, index) => ({
        ...block,
        order: index,
      })
    );

    setForm((prev) => ({
      ...prev,
      blocks: reordered,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-tyrell-dark font-light">
          Sección Contacto
        </h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none px-6 tracking-wider text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Guardar
        </Button>
      </div>

      <div className="bg-white border border-tyrell-gold/20 p-6 rounded-lg">
        <h3 className="font-display text-lg text-tyrell-dark mb-4">
          Colores de la Sección
        </h3>

        <div className="p-6 rounded mb-4" style={{ backgroundColor: colorForm.bgColor }}>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div
                className="h-[1px] w-10"
                style={{ backgroundColor: `${colorForm.labelColor}66` }}
              />
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: colorForm.labelColor }}
              >
                Contacto
              </span>
              <div
                className="h-[1px] w-10"
                style={{ backgroundColor: `${colorForm.labelColor}66` }}
              />
            </div>
            <h2 className="font-display text-xl" style={{ color: colorForm.titleColor }}>
              Contáctanos
            </h2>
            <p className="text-sm mt-1" style={{ color: colorForm.subtitleColor }}>
              Estamos aquí para ti
            </p>
          </div>
          <div className="max-w-xs mx-auto">
            <div
              className="h-10 rounded-none mb-2 border"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderColor: `${colorForm.inputBorderColor}4D`,
              }}
            />
            <button
              className="w-full py-2 text-xs tracking-wider uppercase"
              style={{
                backgroundColor: colorForm.buttonBgColor,
                color: colorForm.buttonTextColor,
              }}
            >
              ENVIAR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InlineColorPicker label="Fondo" value={colorForm.bgColor} onChange={(v) => updateColor("bgColor", v)} />
          <InlineColorPicker label="Etiqueta" value={colorForm.labelColor} onChange={(v) => updateColor("labelColor", v)} />
          <InlineColorPicker label="Título" value={colorForm.titleColor} onChange={(v) => updateColor("titleColor", v)} />
          <InlineColorPicker label="Subtítulo" value={colorForm.subtitleColor} onChange={(v) => updateColor("subtitleColor", v)} />
          <InlineColorPicker label="Botón Fondo" value={colorForm.buttonBgColor} onChange={(v) => updateColor("buttonBgColor", v)} />
          <InlineColorPicker label="Botón Texto" value={colorForm.buttonTextColor} onChange={(v) => updateColor("buttonTextColor", v)} />
          <InlineColorPicker label="Borde Inputs" value={colorForm.inputBorderColor} onChange={(v) => updateColor("inputBorderColor", v)} />
        </div>
      </div>

      <div className="bg-white border border-tyrell-gold/10 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
              Título de la sección
            </label>
            <Input
              value={form.title || ""}
              onChange={(e) => update("title", e.target.value)}
              className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
              Subtítulo
            </label>
            <Input
              value={form.subtitle || ""}
              onChange={(e) => update("subtitle", e.target.value)}
              className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-tyrell-ivory rounded">
          <div>
            <label className="block text-sm font-medium text-tyrell-dark">
              Mostrar Ubicación
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Activa o desactiva la sección de ubicación
            </p>
          </div>
          <Switch
            checked={form.showLocation !== false}
            onCheckedChange={(checked) => update("showLocation", checked)}
          />
        </div>

        {form.showLocation !== false && (
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
              Dirección
            </label>
            <Input
              value={form.address || ""}
              onChange={(e) => update("address", e.target.value)}
              className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
            />
          </div>
        )}

        <div>
          <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
            Etiqueta de WhatsApp
          </label>
          <Input
            value={form.whatsappLabel || ""}
            onChange={(e) => update("whatsappLabel", e.target.value)}
            className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
              Título de horario
            </label>
            <Input
              value={form.scheduleTitle || ""}
              onChange={(e) => update("scheduleTitle", e.target.value)}
              className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
              Horario (L-S)
            </label>
            <Input
              value={form.schedule || ""}
              onChange={(e) => update("schedule", e.target.value)}
              className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-wider uppercase text-gray-500 mb-1.5">
            Horario (Domingos)
          </label>
          <Input
            value={form.scheduleWeekend || ""}
            onChange={(e) => update("scheduleWeekend", e.target.value)}
            className="rounded-none border-tyrell-gold/20 focus:border-tyrell-gold/50 h-11"
          />
        </div>
      </div>

      <div className="bg-white border border-tyrell-gold/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark">
              Bloques internos
            </h3>
            <p className="text-xs text-tyrell-dark/50 mt-1">
              Aquí podrás crear bloques dentro de la sección Contacto y moverlos de posición.
            </p>
          </div>

          <Button
            type="button"
            onClick={addBlock}
            className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white rounded-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir bloque
          </Button>
        </div>

        {(form.blocks || []).length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={(form.blocks || []).map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {(form.blocks || []).map((block, index) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onUpdate={(updatedBlock) => updateBlock(index, updatedBlock)}
                    onDelete={() => removeBlock(index)}
                    onToggle={() => toggleBlockVisibility(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="border border-dashed border-tyrell-gold/20 p-8 text-center text-sm text-tyrell-dark/50">
            Aún no hay bloques en esta sección
          </div>
        )}
      </div>
    </div>
  );
};