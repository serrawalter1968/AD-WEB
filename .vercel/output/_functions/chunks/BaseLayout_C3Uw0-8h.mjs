import { c as createComponent } from './astro-component_Bicik8Fu.mjs';
import 'piccolore';
import { q as renderHead, s as renderSlot, t as renderTemplate } from './entrypoint_Cpe5csRA.mjs';
import 'clsx';

const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title ? `${title} | AD Web` : "AD Web - Stock de Calzado"}</title>${renderHead()}</head> <body class="bg-gray-50 text-gray-900 min-h-screen"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "D:/ProyectosWalter/AD-web/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
