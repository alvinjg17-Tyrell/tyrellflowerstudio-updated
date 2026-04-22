import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageUploader } from "./ImageUploader";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
  id: `about-block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
    id: block.id || `about-block-${index}`,
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
        isDragging ? "shadow-lg border-[#C9A96E]" : "border-[#C9A96E]/10"
      }`}
    >
      <div className="flex items-center gap-3 p-4 border-b border-[#C9A96E]/10">
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
            <ChevronUp className="w-4 h-4 text-[#C9A96E]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#C9A96E]" />
          )}
          <div>
            <p className="text-sm font-medium text-[#1a1a1a]">
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
              ? "text-[#C9A96E] hover:bg-[#C9A96E]/10"
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
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
                Tipo de bloque
              </label>
              <select
                value={block.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full h-11 border border-[#C9A96E]/20 bg-white text-sm px-3 focus:border-[#C9A96E]/50 focus:outline-none"
              >
                {BLOCK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
                Título
              </label>
              <Input
                value={block.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
              Subtítulo
            </label>
            <Input
              value={block.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
              Contenido
            </label>
            <Textarea
              value={block.content}
              onChange={(e) => updateField("content", e.target.value)}
              rows={4}
              className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ImageUploader
              label="Imagen del bloque"
              value={block.image || ""}
              onChange={(url) => updateField("image", url)}
            />

            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
                URL de video
              </label>
              <Input
                value={block.video}
                onChange={(e) => updateField("video", e.target.value)}
                placeholder="https://..."
                className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
                Color de fondo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.backgroundColor || "#FFFFFF"}
                  onChange={(e) => updateField("backgroundColor", e.target.value)}
                  className="w-12 h-11 border border-[#C9A96E]/20"
                />
                <Input
                  value={block.backgroundColor || "#FFFFFF"}
                  onChange={(e) => updateField("backgroundColor", e.target.value)}
                  className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
                Color de texto
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.textColor || "#1a1a1a"}
                  onChange={(e) => updateField("textColor", e.target.value)}
                  className="w-12 h-11 border border-[#C9A96E]/20"
                />
                <Input
                  value={block.textColor || "#1a1a1a"}
                  onChange={(e) => updateField("textColor", e.target.value)}
                  className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
                />
              </div>
            </div>
          </div>

          <div className="border border-[#C9A96E]/10">
            <div className="px-3 py-2 text-xs uppercase tracking-wider text-gray-500 border-b border-[#C9A96E]/10">
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
              <h4 className="text-2xl font-['Playfair_Display'] mb-3">
                {block.title || "Título del bloque"}
              </h4>
              {block.content && (
                <p className="text-sm leading-6 opacity-80">{block.content}</p>
              )}
              {block.image && (
                <img
                  src={block.image}
                  alt=""
                  className="mt-4 w-full max-w-xs h-auto object-cover"
                />
              )}
              {block.video && (
                <p className="mt-4 text-xs opacity-70">Video agregado</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminAbout = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content.about);

  useEffect(() => {
    setForm({
      ...content.about,
      blocks: normalizeBlocks(content.about?.blocks || []),
    });
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
      about: {
        ...form,
        blocks: normalizeBlocks(form.blocks || []).map((block, index) => ({
          ...block,
          order: index,
        })),
      },
    });
  };

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateFeature = (index, field, value) => {
    const updated = [...(form.features || [])];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [
        ...(prev.features || []),
        { title: "", description: "", icon: "Flower2" },
      ],
    }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

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

  const iconOptions = [
    "Flower2",
    "Sparkles",
    "Clock",
    "Heart",
    "Star",
    "Gift",
    "Truck",
    "Shield",
    "Award",
    "Leaf",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-['Playfair_Display'] text-2xl text-[#1a1a1a] font-light">
          Sección Nosotros
        </h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none px-6 tracking-wider text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Guardar
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#C9A96E]/10 p-6 space-y-5">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
              Etiqueta superior
            </label>
            <Input
              value={form.label || ""}
              onChange={(e) => update("label", e.target.value)}
              className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
              Título
            </label>
            <Input
              value={form.title || ""}
              onChange={(e) => update("title", e.target.value)}
              className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
              Subtítulo
            </label>
            <Input
              value={form.subtitle || ""}
              onChange={(e) => update("subtitle", e.target.value)}
              className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
              Descripción
            </label>
            <Textarea
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
                Número del badge
              </label>
              <Input
                value={form.badgeNumber || ""}
                onChange={(e) => update("badgeNumber", e.target.value)}
                className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
                placeholder="+2000"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[#1a1a1a]/50 mb-1.5">
                Texto del badge
              </label>
              <Input
                value={form.badgeLabel || ""}
                onChange={(e) => update("badgeLabel", e.target.value)}
                className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-11"
                placeholder="Arreglos Entregados"
              />
            </div>
          </div>
          <ImageUploader
            label="Imagen de la sección"
            value={form.image || ""}
            onChange={(url) => update("image", url)}
          />
        </div>

        <div className="bg-white border border-[#C9A96E]/10 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs tracking-wider uppercase text-[#1a1a1a]/50">
              Características
            </label>
            <button
              onClick={addFeature}
              className="flex items-center gap-1 text-[#C9A96E] hover:text-[#A67C52] text-xs tracking-wider transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Añadir
            </button>
          </div>

          {(form.features || []).map((feat, i) => (
            <div
              key={i}
              className="border border-[#C9A96E]/10 p-4 space-y-3 relative"
            >
              <button
                onClick={() => removeFeature(i)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <Input
                value={feat.title}
                onChange={(e) => updateFeature(i, "title", e.target.value)}
                placeholder="Título"
                className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 h-10 text-sm"
              />
              <Textarea
                value={feat.description}
                onChange={(e) => updateFeature(i, "description", e.target.value)}
                placeholder="Descripción"
                rows={2}
                className="rounded-none border-[#C9A96E]/20 focus:border-[#C9A96E]/50 resize-none text-sm"
              />
              <select
                value={feat.icon}
                onChange={(e) => updateFeature(i, "icon", e.target.value)}
                className="w-full h-10 border border-[#C9A96E]/20 bg-white text-sm px-3 focus:border-[#C9A96E]/50 focus:outline-none"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#C9A96E]/10 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase text-[#A67C52]">
              Bloques internos
            </h3>
            <p className="text-xs text-[#1a1a1a]/50 mt-1">
              Aquí podrás crear bloques dentro de la sección Nosotros y moverlos de posición.
            </p>
          </div>

          <Button
            type="button"
            onClick={addBlock}
            className="bg-[#C9A96E] hover:bg-[#A67C52] text-white rounded-none"
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
          <div className="border border-dashed border-[#C9A96E]/20 p-8 text-center text-sm text-[#1a1a1a]/50">
            Aún no hay bloques en esta sección
          </div>
        )}
      </div>
    </div>
  );
};