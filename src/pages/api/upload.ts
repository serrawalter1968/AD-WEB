import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '../../lib/auth';
import { uploadImage } from '../../lib/blob';

export const POST: APIRoute = async (context) => {
  try {
    const user = await getAuthenticatedUser(context);
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await context.request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se envió ningún archivo' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Solo se permiten imágenes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'La imagen no puede superar los 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = await uploadImage(file);

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al subir la imagen' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
