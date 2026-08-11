import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/authorization';
import { orderService, OrderServiceError } from '@/services/order.service';
import { ok, forbidden, notFound, internalError } from '@/lib/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;

  try {
    const isAdmin = user.role === 'ADMIN';
    const order = await orderService.getOrderById(id, user.id, isAdmin);
    return ok(order);
  } catch (error: unknown) {
    if (error instanceof OrderServiceError) {
      if (error.statusCode === 403) return forbidden(error.message);
      if (error.statusCode === 404) return notFound(error.message);
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch order details';
    return internalError(message);
  }
}
