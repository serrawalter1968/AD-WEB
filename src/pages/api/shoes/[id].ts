import type { APIRoute } from 'astro';
import { getShoe, updateShoe, deleteShoe } from '../../../lib/db';
import { getAuthenticatedUser } from '../../../lib/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const shoe = await getShoe(Number(params.id));
    if (!shoe) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(shoe), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al obtener producto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await context.request.json();
    const shoe = await updateShoe(Number(context.params.id), {
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      quantity: body.quantity !== undefined ? parseInt(body.quantity) : undefined,
      image_url: body.image_url,
    });

    if (!shoe) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(shoe), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al actualizar producto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const deleted = await deleteShoe(Number(context.params.id));
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error al eliminar producto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
