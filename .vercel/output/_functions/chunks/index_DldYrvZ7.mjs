import { c as createComponent } from './astro-component_DL_opeNw.mjs';
import 'piccolore';
import { p as renderComponent, t as renderTemplate } from './entrypoint_C4QlUByW.mjs';
import { $ as $$AdminLayout } from './AdminLayout_CyPmSofL.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchShoes = async () => {
    try {
      const res = await fetch("/api/shoes");
      if (res.ok) {
        setShoes(await res.json());
      }
    } catch (e) {
      console.error("Error fetching shoes:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchShoes();
  }, []);
  const handleDelete = async (id) => {
    if (!confirm("¿Estás segura de eliminar este producto?")) return;
    const res = await fetch(`/api/shoes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setShoes(shoes.filter((s) => s.id !== id));
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-500", children: "Cargando..." });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Stock de Calzado" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/admin/add",
          className: "bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm font-medium",
          children: "+ Agregar producto"
        }
      )
    ] }),
    shoes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-500", children: "No hay productos. ¡Agregá el primero!" }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full bg-white rounded-lg shadow-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b bg-gray-50", children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-gray-600", children: "Imagen" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-gray-600", children: "Nombre" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-gray-600", children: "Categoría" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-gray-600", children: "Precio" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-gray-600", children: "Stock" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-sm font-medium text-gray-600", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: shoes.map((shoe) => /* @__PURE__ */ jsxs("tr", { className: "border-b hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: shoe.image_url ? /* @__PURE__ */ jsx("img", { src: shoe.image_url, alt: shoe.name, className: "w-12 h-12 object-cover rounded" }) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs", children: "Sin img" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium", children: shoe.name }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: shoe.category || "-" }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
          "$",
          Number(shoe.price).toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `inline-block px-2 py-1 rounded text-xs font-medium ${shoe.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, children: shoe.quantity }) }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `/admin/edit/${shoe.id}`,
              className: "text-blue-600 hover:text-blue-800 text-sm",
              children: "Editar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(shoe.id),
              className: "text-red-600 hover:text-red-800 text-sm cursor-pointer",
              children: "Eliminar"
            }
          )
        ] })
      ] }, shoe.id)) })
    ] }) })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminDashboard", AdminDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProyectosWalter/AD-web/src/components/react/AdminDashboard", "client:component-export": "default" })} ` })}`;
}, "D:/ProyectosWalter/AD-web/src/pages/admin/index.astro", void 0);

const $$file = "D:/ProyectosWalter/AD-web/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
