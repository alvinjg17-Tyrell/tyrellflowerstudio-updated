import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Save, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";
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
  { id: "about", name: "Nosotros", visible: true },
  { id: "services", name: "Productos", visible: true },
  { id: "catalogs", name: "Catálogos", visible: true },
  { id: "contact", name: "Contacto", visible: true },
];

const SortableSection = ({ section, onToggleVisibility }) => {
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
      className={`flex items-center gap-4 p-4 bg-white border rounded-lg ${
        isDragging ? "shadow-lg border-tyrell-gold" : "border-gray-200"
      } ${!section.visible ? "opacity-50" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded touch-none"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex-1">
        <span className="font-display text-lg text-tyrell-dark">{section.name}</span>
        <p className="text-xs text-gray-400 mt-0.5">
          {section.id === "about" && "Sección con información sobre tu negocio"}
          {section.id === "services" && "Catálogo de productos con categorías"}
          {section.id === "catalogs" && "Enlaces externos a tus catálogos"}
          {section.id === "contact" && "Formulario y datos de contacto"}
        </p>
      </div>
      
      <button
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

export const AdminSectionOrder = ({ content, onSave, saving }) => {
  const [sections, setSections] = useState(
    content?.sectionOrder?.sections || defaultSections
  );

  useEffect(() => {
    if (content?.sectionOrder?.sections) {
      setSections(content.sectionOrder.sections);
    }
  }, [content]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
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
    
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleVisibility = (id) => {
    setSections((items) =>
      items.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const handleSave = () => {
    onSave({
      ...content,
      sectionOrder: { sections }
    });
    toast.success("Orden de secciones guardado");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-tyrell-dark font-light">Orden de Secciones</h2>
          <p className="text-sm text-gray-500 mt-1">
            Arrastra las secciones para cambiar su orden en la página. Usa el ícono del ojo para mostrar/ocultar.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          className="bg-tyrell-gold hover:bg-tyrell-gold-dark text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Orden
        </Button>
      </div>

      {/* Preview */}
      <div className="bg-tyrell-ivory/50 border border-tyrell-gold/20 rounded-lg p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Vista previa del orden</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-tyrell-rose-dark text-white text-xs rounded">HERO</span>
          {sections.filter(s => s.visible).map((section, index) => (
            <span key={section.id} className="flex items-center gap-1">
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-tyrell-gold/20 text-tyrell-dark text-xs rounded">
                {section.name.toUpperCase()}
              </span>
            </span>
          ))}
          <span className="text-gray-400">→</span>
          <span className="px-3 py-1 bg-tyrell-sage text-white text-xs rounded">FOOTER</span>
        </div>
      </div>

      {/* Sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onToggleVisibility={toggleVisibility}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className="text-xs text-gray-400 text-center">
        Mantén presionado y arrastra para reordenar • El Hero y Footer siempre se mantienen en su posición
      </p>
    </div>
  );
};
