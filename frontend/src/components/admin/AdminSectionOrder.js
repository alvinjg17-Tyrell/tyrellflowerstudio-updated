import { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Save, Loader2, GripVertical, Eye, EyeOff, Layers } from "lucide-react";
import { toast } from "sonner";
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

const defaultSections = [
  { id: "about", name: "Nosotros", visible: true, type: "fixed" },
  { id: "services", name: "Productos", visible: true, type: "fixed" },
  { id: "catalogs", name: "Catálogos", visible: true, type: "fixed" },
  { id: "contact", name: "Contacto", visible: true, type: "fixed" },
];

const getSectionDescription = (section) => {
  if (section.type === "dynamic") return "Sección dinámica creada desde el panel";
  if (section.id === "about") return "Sección con información sobre tu negocio";
  if (section.id === "services") return "Catálogo de productos con categorías";
  if (section.id === "catalogs") return "Enlaces externos a tus catálogos";
  if (section.id === "contact") return "Formulario y datos de contacto";
  return "Sección del sitio";
};

const SortableSection = ({ section, onToggleVisibility, onChangeName }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-4 p-4 bg-white border rounded-lg ${
        isDragging ? "shadow-lg border-tyrell-gold" : "border-gray-200"
      } ${!section.visible ? "opacity-50" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded touch-none mt-1"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {section.type === "dynamic" && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-tyrell-gold/10 text-tyrell-gold">
              <Layers className="w-3 h-3" />
              Dinámica
            </span>
          )}
        </div>

        <label className="block text-[11px] uppercase text-gray-400 mb-1">
          Nombre visible
        </label>
        <Input
          value={section.name || ""}
          onChange={(e) => onChangeName(section.id, e.target.value)}
          placeholder="Nombre de la sección"
          className="mb-2"
        />
        <p className="text-xs text-gray-400">{getSectionDescription(section)}</p>
      </div>

      <button
        type="button"
        onClick={() => onToggleVisibility(section.id)}
        className={`p-2 rounded-lg transition-colors ${
          section.visible
            ? "text-tyrell-gold hover:bg-tyrell-gold/10"
            : "text-gray-400 hover:bg-gray-100"
        }`}
        title={section.visible ? "Ocultar sección" : "Mostrar sección"}
      >
        {section.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
    </div>
  );
};

const mergeSectionsWithDynamic = (savedSections = [], dynamicSections = []) => {
  const normalizedSaved = Array.isArray(savedSections) && savedSections.length
    ? savedSections.map((section) => ({
        ...section,
        type: section.type || "fixed",
      }))
    : defaultSections;

  const savedIds = new Set(normalizedSaved.map((section) => section.id));

  const dynamicFromAdmin = (dynamicSections || []).map((section, index) => ({
    id: `dynamic:${section.id}`,
    sourceId: section.id,
    name: section.title || `Sección ${index + 1}`,
    visible: section.active !== false,
    type: "dynamic",
  }));

  const missingDynamic = dynamicFromAdmin.filter(
    (section) => !savedIds.has(section.id)
  );

  const merged = [
    ...normalizedSaved,
    ...missingDynamic,
  ];

  return merged.map((section, index) => ({
    ...section,
    visible: section.visible !== false,
    type: section.type || "fixed",
    order: index,
  }));
};

export const AdminSectionOrder = ({
  content,
  dynamicSections = [],
  onSave,
  saving,
}) => {
  const [sections, setSections] = useState(defaultSections);

  const mergedInitialSections = useMemo(
    () =>
      mergeSectionsWithDynamic(content?.sectionOrder?.sections, dynamicSections),
    [content, dynamicSections]
  );

  useEffect(() => {
    setSections(mergedInitialSections);
  }, [mergedInitialSections]);

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));
    });
  };

  const toggleVisibility = (id) => {
    setSections((items) =>
      items.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const changeName = (id, newName) => {
    setSections((items) =>
      items.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  const handleSave = () => {
    onSave({
      ...content,
      sectionOrder: {
        sections: sections.map((section, index) => ({
          id: section.id,
          name: section.name,
          visible: section.visible !== false,
          type: section.type || "fixed",
          order: index,
          ...(section.sourceId ? { sourceId: section.sourceId } : {}),
        })),
      },
    });
    toast.success("Orden de secciones guardado");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-tyrell-dark font-light">
            Orden de Secciones
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Reordena, renombra y muestra u oculta tanto las secciones fijas como las dinámicas.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Guardar Orden
        </Button>
      </div>

      <div className="bg-tyrell-ivory/50 border border-tyrell-gold/20 rounded-lg p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Vista previa del orden
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-tyrell-rose-dark text-white text-xs rounded">
            HERO
          </span>

          {sections
            .filter((s) => s.visible)
            .map((section) => (
              <span key={section.id} className="flex items-center gap-1">
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-tyrell-gold/20 text-tyrell-dark text-xs rounded">
                  {(section.name || section.id).toUpperCase()}
                </span>
              </span>
            ))}

          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 bg-tyrell-sage text-white text-xs rounded">
            FOOTER
          </span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onToggleVisibility={toggleVisibility}
                onChangeName={changeName}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className="text-xs text-gray-400 text-center">
        Mantén presionado y arrastra para reordenar • El Hero y Footer siguen fijos
      </p>
    </div>
  );
};