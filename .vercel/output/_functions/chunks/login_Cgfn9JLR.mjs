import { c as createComponent } from './astro-component_DL_opeNw.mjs';
import 'piccolore';
import { p as renderComponent, t as renderTemplate } from './entrypoint_C4QlUByW.mjs';
import { $ as $$BaseLayout } from './BaseLayout_B_oJ7vVj.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al iniciar sesión");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-8 rounded-lg shadow-md w-full max-w-md", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center mb-6 text-pink-600", children: "AD Web - Admin" }),
    /* @__PURE__ */ jsx("h2", { className: "text-lg text-center mb-6 text-gray-600", children: "Iniciar sesión" }),
    error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 text-red-600 p-3 rounded mb-4 text-sm", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Contraseña" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: loading,
        className: "w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 cursor-pointer font-medium",
        children: loading ? "Ingresando..." : "Ingresar"
      }
    )
  ] }) });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Iniciar sesión" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminLogin", AdminLogin, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProyectosWalter/AD-web/src/components/react/AdminLogin", "client:component-export": "default" })} ` })}`;
}, "D:/ProyectosWalter/AD-web/src/pages/admin/login.astro", void 0);

const $$file = "D:/ProyectosWalter/AD-web/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
