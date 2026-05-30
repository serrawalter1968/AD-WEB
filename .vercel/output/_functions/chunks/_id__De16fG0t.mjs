import { d as deleteShoe, g as getShoe, u as updateShoe } from './db_K85WP9fX.mjs';
import { g as getAuthenticatedUser } from './auth_DuSTqdtf.mjs';

const GET = async ({ params }) => {
  try {
    const shoe = await getShoe(Number(params.id));
    if (!shoe) {
      return new Response(JSON.stringify({ error: "Producto no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(shoe), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error al obtener producto" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async (context) => {
  try {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await context.request.json();
    const shoe = await updateShoe(Number(context.params.id), {
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price !== void 0 ? parseFloat(body.price) : void 0,
      quantity: body.quantity !== void 0 ? parseInt(body.quantity) : void 0,
      image_url: body.image_url
    });
    if (!shoe) {
      return new Response(JSON.stringify({ error: "Producto no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(shoe), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error al actualizar producto" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async (context) => {
  try {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deleted = await deleteShoe(Number(context.params.id));
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Producto no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error al eliminar producto" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
