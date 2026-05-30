import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '../../../lib/auth';

export const GET: APIRoute = async (context) => {
  const user = await getAuthenticatedUser(context);

  if (!user) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ authenticated: true, email: user.email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
