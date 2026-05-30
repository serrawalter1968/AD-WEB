import type { APIRoute } from 'astro';
import { getShoes, createShoe } from '../../lib/db';
import { getAuthenticatedUser } from '../../lib/auth';

export const GET: APIRoute = async () => {
  try {
    const shoes = await getShoes();
    return new Response(JSON.stringify(shoes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener productos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await context.request.json();

    if (!body.name || body.quantity === undefined) {
      return new Response(JSON.stringify({ error: 'Nombre y cantidad son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const shoe = await createShoe({
      name: body.name,
      description: body.description || '',
      category: body.category || '',
      price: parseFloat(body.price) || 0,
      quantity: parseInt(body.quantity) || 0,
      image_url: body.image_url || '',
    });

    return new Response(JSON.stringify(shoe), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear producto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
