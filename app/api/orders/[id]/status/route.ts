import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/authorization';
import { updateOrderStatusSchema } from '@/lib/validations/order.schema';
import { orderService, OrderServiceError } from '@/services/order.service';
import { ok, validationError, forbidden, notFound, internalError } from '@/lib/response';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  try {
    const body = await req.json();
    const validated = updateOrderStatusSchema.parse(body);

    const updatedOrder = await orderService.updateOrderStatus(
      id,
      validated.status,
      user.role === 'ADMIN'
    );

    return ok(updatedOrder, `Order status updated to ${validated.status}`);
  } catch (error: unknown) {
    if (error instanceof OrderServiceError) {
      if (error.statusCode === 403) return forbidden(error.message);
      if (error.statusCode === 404) return notFound(error.message);
      return validationError(error.message);
    }

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return validationError('Invalid status payload provided', error);
    }

    const message = error instanceof Error ? error.message : 'Failed to update order status';
    return internalError(message);
  }
}
