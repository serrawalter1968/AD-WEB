import { e as getUserByEmail, a as createUser } from './db_K85WP9fX.mjs';
import { g as getAuthenticatedUser, h as hashPassword } from './auth_DuSTqdtf.mjs';

const POST = async (context) => {
  try {
    const admin = await getAuthenticatedUser(context);
    if (!admin) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { email, password } = await context.request.json();
    if (!email || !password || password.length < 6) {
      return new Response(JSON.stringify({ error: "Email válido y contraseña de al menos 6 caracteres requeridos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existing = await getUserByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ error: "El email ya está registrado" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash);
    return new Response(JSON.stringify({ success: true, email: user.email }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
