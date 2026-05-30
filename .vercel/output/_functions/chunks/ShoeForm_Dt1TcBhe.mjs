import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';

function ShoeForm({ initialData }) {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    quantity: initialData?.quantity || "",
    image_url: initialData?.image_url || ""
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const formData = new FormData();
    formData.append("file", f);
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data2 = await res.json();
        setError(data2.error || "Error al subir imagen");
        return;
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, image_url: data.url }));
    } catch {
      setError("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/shoes/${initialData.id}` : "/api/shoes";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          price: parseFloat(form.price) || 0,
          quantity: parseInt(form.quantity) || 0,
          image_url: form.image_url
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6", children: isEdit ? "Editar producto" : "Agregar producto" }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 text-red-600 p-3 rounded mb-4 text-sm", children: error }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded-lg shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nombre *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: form.name,
            onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
            required: true,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Descripción" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: form.description,
            onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
            rows: 3,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Categoría" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: form.category,
              onChange: (e) => setForm((p) => ({ ...p, category: e.target.value })),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar" }),
                /* @__PURE__ */ jsx("option", { value: "Zapatos", children: "Zapatos" }),
                /* @__PURE__ */ jsx("option", { value: "Zapatillas", children: "Zapatillas" }),
                /* @__PURE__ */ jsx("option", { value: "Botas", children: "Botas" }),
                /* @__PURE__ */ jsx("option", { value: "Sandalias", children: "Sandalias" }),
                /* @__PURE__ */ jsx("option", { value: "Tacos", children: "Tacos" }),
                /* @__PURE__ */ jsx("option", { value: "Otros", children: "Otros" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Precio" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              step: "0.01",
              value: form.price,
              onChange: (e) => setForm((p) => ({ ...p, price: e.target.value })),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cantidad en stock *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            min: "0",
            value: form.quantity,
            onChange: (e) => setForm((p) => ({ ...p, quantity: e.target.value })),
            required: true,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Imagen" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            onChange: handleUpload,
            className: "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
          }
        ),
        uploading && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Subiendo imagen..." }),
        form.image_url && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("img", { src: form.image_url, alt: "Preview", className: "w-16 h-16 object-cover rounded" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 truncate max-w-[200px]", children: form.image_url })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: saving || uploading,
            className: "bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 cursor-pointer font-medium",
            children: saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Agregar producto"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/admin",
            className: "bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 text-center font-medium",
            children: "Cancelar"
          }
        )
      ] })
    ] })
  ] });
}

export { ShoeForm as S };
