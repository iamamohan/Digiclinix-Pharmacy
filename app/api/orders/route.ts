import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/authorization';
import { createOrderSchema } from '@/lib/validations/order.schema';
import { orderService, OrderServiceError } from '@/services/order.service';
import { ok, created, validationError, conflict, internalError, notFound } from '@/lib/response';

export async function POST(req: NextRequest) {
  const { user, response } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    // Create order using authenticated user ID (never trusts client-side user IDs)
    const order = await orderService.createOrder(user.id, validatedData);

    return created(order, 'Order created successfully');
  } catch (error: unknown) {
    if (error instanceof OrderServiceError) {
      if (error.statusCode === 404) return notFound(error.message);
      if (error.statusCode === 409) return conflict(error.message);
      return validationError(error.message);
    }

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return validationError('Invalid order data provided', error);
    }

    const message = error instanceof Error ? error.message : 'Failed to create order';
    return internalError(message);
  }
}

export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;

  try {
    if (user.role === 'ADMIN') {
      const orders = await orderService.getAllOrders();
      return ok(orders);
    }

    const orders = await orderService.getUserOrders(user.id);
    return ok(orders);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    return internalError(message);
  }
}
