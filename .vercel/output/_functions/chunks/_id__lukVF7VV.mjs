import { c as createComponent } from './astro-component_DL_opeNw.mjs';
import 'piccolore';
import { p as renderComponent, t as renderTemplate, o as maybeRenderHead } from './entrypoint_C4QlUByW.mjs';
import { $ as $$AdminLayout } from './AdminLayout_CyPmSofL.mjs';
import { S as ShoeForm } from './ShoeForm_Dt1TcBhe.mjs';
import { g as getShoe } from './db_K85WP9fX.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const shoe = await getShoe(Number(id));
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, {}, { "default": async ($$result2) => renderTemplate`${shoe ? renderTemplate`${renderComponent($$result2, "ShoeForm", ShoeForm, { "client:load": true, "initialData": {
    id: shoe.id,
    name: shoe.name,
    description: shoe.description,
    category: shoe.category,
    price: String(shoe.price),
    quantity: String(shoe.quantity),
    image_url: shoe.image_url
  }, "client:component-hydration": "load", "client:component-path": "D:/ProyectosWalter/AD-web/src/components/react/ShoeForm", "client:component-export": "default" })}` : renderTemplate`${maybeRenderHead()}<div class="text-center py-12 text-gray-500">Producto no encontrado</div>`}` })}`;
}, "D:/ProyectosWalter/AD-web/src/pages/admin/edit/[id].astro", void 0);

const $$file = "D:/ProyectosWalter/AD-web/src/pages/admin/edit/[id].astro";
const $$url = "/admin/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
