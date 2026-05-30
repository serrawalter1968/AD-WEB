import { c as clearAuthCookie } from './auth_DuSTqdtf.mjs';

const POST = async (context) => {
  clearAuthCookie(context);
  return context.redirect("/admin/login", 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
