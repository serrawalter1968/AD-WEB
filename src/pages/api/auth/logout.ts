import type { APIRoute } from 'astro';
import { clearAuthCookie } from '../../../lib/auth';

export const POST: APIRoute = async (context) => {
  clearAuthCookie(context);
  return context.redirect('/admin/login', 302);
};
