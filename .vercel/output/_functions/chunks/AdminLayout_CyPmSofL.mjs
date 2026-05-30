import { c as createComponent } from './astro-component_DL_opeNw.mjs';
import 'piccolore';
import { p as renderComponent, t as renderTemplate, o as maybeRenderHead, s as renderSlot } from './entrypoint_C4QlUByW.mjs';
import { $ as $$BaseLayout } from './BaseLayout_B_oJ7vVj.mjs';
import { g as getAuthenticatedUser } from './auth_DuSTqdtf.mjs';

const $$AdminLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdminLayout;
  const user = await getAuthenticatedUser(Astro2);
  if (!user) {
    return Astro2.redirect("/admin/login");
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Panel Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<nav class="bg-white shadow-sm border-b"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between h-16 items-center"> <a href="/admin" class="text-xl font-bold text-pink-600">AD Web - Admin</a> <div class="flex gap-4 items-center"> <span class="text-sm text-gray-500">${user.email}</span> <a href="/" class="text-sm text-gray-600 hover:text-gray-900">Ver tienda</a> <form method="POST" action="/api/auth/logout"> <button type="submit" class="text-sm text-red-600 hover:text-red-800 cursor-pointer">Cerrar sesión</button> </form> </div> </div> </div> </nav> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> ${renderSlot($$result2, $$slots["default"])} </main> ` })}`;
}, "D:/ProyectosWalter/AD-web/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
