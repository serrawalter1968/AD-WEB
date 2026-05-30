import { c as createComponent } from './astro-component_DL_opeNw.mjs';
import 'piccolore';
import { p as renderComponent, t as renderTemplate } from './entrypoint_C4QlUByW.mjs';
import { $ as $$AdminLayout } from './AdminLayout_CyPmSofL.mjs';
import { S as ShoeForm } from './ShoeForm_Dt1TcBhe.mjs';

const $$Add = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ShoeForm", ShoeForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ProyectosWalter/AD-web/src/components/react/ShoeForm", "client:component-export": "default" })} ` })}`;
}, "D:/ProyectosWalter/AD-web/src/pages/admin/add.astro", void 0);

const $$file = "D:/ProyectosWalter/AD-web/src/pages/admin/add.astro";
const $$url = "/admin/add";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Add,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
