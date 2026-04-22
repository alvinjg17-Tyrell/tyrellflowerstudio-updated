import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Save, Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import { InlineColorPicker } from "./InlineColorPicker";

const defaultNavItems = [
  {
    id: "inicio",
    label: "Inicio",
    type: "route",
    target: "/",
    visible: true,
    order: 0,
    children: [],
  },
  {
    id: "nosotros",
    label: "Nosotros",
    type: "route",
    target: "/nosotros",
    visible: true,
    order: 1,
    children: [],
  },
  {
    id: "servicios",
    label: "Servicios",
    type: "dropdown",
    target: "",
    visible: true,
    order: 2,
    children: [
      {
        id: "ver-destacados",
        label: "Ver destacados",
        type: "anchor",
        target: "/#services",
        visible: true,
        order: 0,
        children: [],
      },
      {
        id: "ver-todo",
        label: "Ver todo",
        type: "anchor",
        target: "/#catalogo-completo",
        visible: true,
        order: 1,
        children: [],
      },
    ],
  },
  {
    id: "contacto",
    label: "Contacto",
    type: "route",
    target: "/contacto",
    visible: true,
    order: 3,
    children: [],
  },
];

const defaultHeader = {
  topBarLeft: "Jirón Esperanza 210, Moyobamba, Perú",
  topBarRight: "",
  navItems: defaultNavItems,
  ctaText: "VER CATÁLOGO",
  ctaButtonColor: "#D8A7B1",
  ctaTextColor: "#FFFFFF",
  topBarBgColor: "#B76E79",
  topBarTextColor: "#FFFFFF",
  dropdownBgColor: "#B76E79",
  dropdownTextColor: "#FFFFFF",
};

const createNavItem = (label = "Nuevo ítem", type = "route", target = "") => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label,
  type,
  target,
  visible: true,
  order: 0,
  children: [],
});

const normalizeNavItems = (items = []) =>
  (items || []).map((item, index) => ({
    id: item.id || `item-${index}`,
    label: item.label || "",
    type: item.type || "route",
    target: item.target || "",
    visible: item.visible !== false,
    order: typeof item.order === "number" ? item.order : index,
    children: normalizeNavItems(item.children || []),
  }));

const NavItemEditor = ({
  item,
  index,
  onUpdate,
  onDelete,
  isChild = false,
  dropdownBgColor,
  dropdownTextColor,
}) => {
  const updateField = (field, value) => {
    onUpdate({
      ...item,
      [field]: value,
    });
  };

  const updateChild = (childIndex, updatedChild) => {
    const nextChildren = [...(item.children || [])];
    nextChildren[childIndex] = { ...updatedChild, order: childIndex };
    updateField("children", nextChildren);
  };

  const addChild = () => {
    const nextChildren = [...(item.children || [])];
    nextChildren.push(
      createNavItem("Nuevo subitem", "anchor", "/#nuevo-bloque")
    );
    updateField(
      "children",
      nextChildren.map((child, i) => ({ ...child, order: i }))
    );
  };

  const deleteChild = (childIndex) => {
    const nextChildren = (item.children || [])
      .filter((_, i) => i !== childIndex)
      .map((child, i) => ({ ...child, order: i }));
    updateField("children", nextChildren);
  };

  return (
    <div
      className={`border rounded-lg p-4 space-y-4 ${
        isChild ? "bg-white border-tyrell-rose/10" : "bg-tyrell-ivory/40 border-tyrell-gold/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 grid md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] uppercase text-gray-500 mb-1">
              Nombre
            </label>
            <Input
              value={item.label || ""}
              onChange={(e) => updateField("label", e.target.value)}
              className="h-10"
              placeholder="Ej: Servicios"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase text-gray-500 mb-1">
              Tipo
            </label>
            <select
              value={item.type || "route"}
              onChange={(e) => updateField("type", e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded text-sm bg-white"
            >
              <option value="route">Ruta</option>
              <option value="anchor">Bloque / Ancla</option>
              <option value="dropdown">Desplegable</option>
              <option value="external">Enlace externo</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase text-gray-500 mb-1">
              Destino
            </label>
            <Input
              value={item.target || ""}
              onChange={(e) => updateField("target", e.target.value)}
              className="h-10"
              placeholder={
                item.type === "route"
                  ? "/eventos"
                  : item.type === "anchor"
                  ? "/#flores-premium"
                  : item.type === "external"
                  ? "https://..."
                  : "Opcional"
              }
              disabled={item.type === "dropdown"}
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={item.visible !== false}
              onChange={(e) => updateField("visible", e.target.checked)}
              className="accent-tyrell-gold"
            />
            Visible
          </label>

          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Eliminar ítem"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {item.type === "dropdown" && (
        <div className="border-t border-tyrell-rose/10 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm uppercase tracking-wider text-tyrell-rose-dark">
                Subitems del desplegable
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Puedes añadir rutas, bloques o enlaces dentro de este menú.
              </p>
            </div>

            <Button
              type="button"
              onClick={addChild}
              variant="outline"
              className="border-tyrell-gold text-tyrell-gold hover:bg-tyrell-gold/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir subitem
            </Button>
          </div>

          <div
            className="rounded border p-3"
            style={{
              backgroundColor: dropdownBgColor || "#B76E79",
              color: dropdownTextColor || "#FFFFFF",
            }}
          >
            <div className="flex items-center gap-2 text-sm uppercase tracking-wider mb-3">
              <span>{item.label || "Desplegable"}</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            <div className="space-y-2">
              {(item.children || []).length > 0 ? (
                item.children.map((child, childIndex) => (
                  <NavItemEditor
                    key={child.id || childIndex}
                    item={child}
                    index={childIndex}
                    isChild
                    dropdownBgColor={dropdownBgColor}
                    dropdownTextColor={dropdownTextColor}
                    onUpdate={(updatedChild) => updateChild(childIndex, updatedChild)}
                    onDelete={() => deleteChild(childIndex)}
                  />
                ))
              ) : (
                <p className="text-xs opacity-80">No hay subitems aún</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminHeaderSection = ({ content, onSave, saving }) => {
  const [form, setForm] = useState({
    ...defaultHeader,
    ...(content.header || {}),
    navItems: normalizeNavItems(content.header?.navItems || defaultHeader.navItems),
  });

  useEffect(() => {
    setForm({
      ...defaultHeader,
      ...(content.header || {}),
      topBarLeft:
        content.header?.topBarLeft ||
        content.brand?.location ||
        defaultHeader.topBarLeft,
      navItems: normalizeNavItems(
        content.header?.navItems || defaultHeader.navItems
      ),
    });
  }, [content]);

  const handleSave = () => {
    const normalizedForm = {
      ...form,
      navItems: normalizeNavItems(form.navItems).map((item, index) => ({
        ...item,
        order: index,
        children: normalizeNavItems(item.children || []).map((child, childIndex) => ({
          ...child,
          order: childIndex,
        })),
      })),
    };

    onSave({ ...content, header: normalizedForm });
  };

  const update = (field, value) =>
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  const updateNavItem = (index, updatedItem) => {
    const next = [...(form.navItems || [])];
    next[index] = { ...updatedItem, order: index };
    update("navItems", next);
  };

  const deleteNavItem = (index) => {
    const next = (form.navItems || [])
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order: i }));
    update("navItems", next);
  };

  const addNavItem = () => {
    const next = [...(form.navItems || [])];
    next.push(createNavItem("Nuevo menú", "route", "/nueva-pagina"));
    update(
      "navItems",
      next.map((item, i) => ({ ...item, order: i }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-2xl text-tyrell-olive font-light">
          Encabezado de la Página
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

      <div className="bg-white border border-tyrell-rose/10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark">
            Barra Superior
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Fondo:</span>
            <InlineColorPicker
              value={form.topBarBgColor}
              onChange={(color) => update("topBarBgColor", color)}
              label="Color de fondo barra superior"
            />
            <span className="text-xs text-gray-500">Texto:</span>
            <InlineColorPicker
              value={form.topBarTextColor}
              onChange={(color) => update("topBarTextColor", color)}
              label="Color de texto barra superior"
            />
          </div>
        </div>

        <div
          className="p-3 text-center text-sm"
          style={{
            backgroundColor: form.topBarBgColor || "#B76E79",
            color: form.topBarTextColor || "#FFFFFF",
          }}
        >
          <span>{form.topBarLeft || "Ubicación"}</span>
          {form.topBarRight && <span className="ml-4">{form.topBarRight}</span>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">
              Texto izquierdo (ubicación)
            </label>
            <Input
              value={form.topBarLeft || ""}
              onChange={(e) => update("topBarLeft", e.target.value)}
              className="rounded-none border-tyrell-rose/20 h-11"
              placeholder="Ej: Jirón Esperanza 210, Moyobamba, Perú"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-tyrell-olive/50 mb-1.5">
              Texto derecho (opcional)
            </label>
            <Input
              value={form.topBarRight || ""}
              onChange={(e) => update("topBarRight", e.target.value)}
              className="rounded-none border-tyrell-rose/20 h-11"
              placeholder="Ej: Envíos a todo el país"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-tyrell-rose/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark">
              Botón CTA
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Botón:</span>
              <InlineColorPicker
                value={form.ctaButtonColor}
                onChange={(color) => update("ctaButtonColor", color)}
                label="Color del botón"
              />
              <span className="text-xs text-gray-500">Texto:</span>
              <InlineColorPicker
                value={form.ctaTextColor}
                onChange={(color) => update("ctaTextColor", color)}
                label="Color del texto"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs text-gray-500">Vista previa:</span>
            <button
              className="px-6 py-2 text-sm tracking-wider uppercase font-medium"
              style={{
                backgroundColor: form.ctaButtonColor || "#D8A7B1",
                color: form.ctaTextColor || "#FFFFFF",
              }}
            >
              {form.ctaText || "VER CATÁLOGO"}
            </button>
          </div>

          <Input
            value={form.ctaText || ""}
            onChange={(e) => update("ctaText", e.target.value)}
            className="rounded-none border-tyrell-rose/20 h-11"
            placeholder="Ej: VER CATÁLOGO"
          />
        </div>

        <div className="pt-4 border-t border-tyrell-rose/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark">
              Colores del desplegable
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Fondo:</span>
              <InlineColorPicker
                value={form.dropdownBgColor || "#B76E79"}
                onChange={(color) => update("dropdownBgColor", color)}
                label="Color de fondo del desplegable"
              />
              <span className="text-xs text-gray-500">Texto:</span>
              <InlineColorPicker
                value={form.dropdownTextColor || "#FFFFFF"}
                onChange={(color) => update("dropdownTextColor", color)}
                label="Color de texto del desplegable"
              />
            </div>
          </div>

          <div
            className="p-4 border"
            style={{
              backgroundColor: form.dropdownBgColor || "#B76E79",
              color: form.dropdownTextColor || "#FFFFFF",
            }}
          >
            <div className="inline-flex items-center gap-2 text-sm uppercase tracking-wider mb-3">
              <span>Servicios</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="space-y-2 text-sm">
              <div>Ver destacados</div>
              <div>Ver todo</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-tyrell-rose/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium tracking-wider uppercase text-tyrell-rose-dark">
                Navegación editable
              </h3>
              <p className="text-xs text-tyrell-olive/50 mt-1">
                Puedes crear rutas, bloques, desplegables y enlaces externos.
              </p>
            </div>

            <Button
              type="button"
              onClick={addNavItem}
              variant="outline"
              className="border-tyrell-gold text-tyrell-gold hover:bg-tyrell-gold/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir menú
            </Button>
          </div>

          <div className="space-y-3">
            {(form.navItems || []).map((item, index) => (
              <NavItemEditor
                key={item.id || index}
                item={item}
                index={index}
                dropdownBgColor={form.dropdownBgColor}
                dropdownTextColor={form.dropdownTextColor}
                onUpdate={(updatedItem) => updateNavItem(index, updatedItem)}
                onDelete={() => deleteNavItem(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminHeaderSection as AdminHeader };