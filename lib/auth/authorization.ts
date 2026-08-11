import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { unauthorized, forbidden } from '@/lib/response';

/**
 * Returns the current authenticated user's session data, or null.
 * Role is read from the JWT (which sources it from the DB).
 * Never exposes passwordHash, OAuth tokens, or secrets.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    role: session.user.role ?? 'USER',
  };
}

/**
 * Returns the current session user or a 401 Unauthorized Response.
 * Use in API routes that require any authenticated user.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: unauthorized('You must be signed in to perform this action.') };
  }
  return { user, response: null };
}

/**
 * Returns the current session user only if they are ADMIN, otherwise returns a 401 or 403 Response.
 * Use in API routes that require ADMIN role.
 *
 * Behavior:
 *   - Unauthenticated → 401 Unauthorized
 *   - Authenticated USER → 403 Forbidden
 *   - Authenticated ADMIN → { user, response: null }
 */
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, response: unauthorized('You must be signed in to perform this action.') };
  }

  if (user.role !== 'ADMIN') {
    return {
      user: null,
      response: forbidden('You do not have permission to perform this action.'),
    };
  }

  return { user, response: null };
}
