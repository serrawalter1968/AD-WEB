import { e as getUserByEmail } from './db_K85WP9fX.mjs';
import { v as verifyPassword, a as createToken, s as setAuthCookie } from './auth_DuSTqdtf.mjs';

const POST = async (context) => {
  try {
    const { email, password } = await context.request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email y contraseña son requeridos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = await createToken({ userId: user.id, email: user.email });
    setAuthCookie(context, token);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
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
