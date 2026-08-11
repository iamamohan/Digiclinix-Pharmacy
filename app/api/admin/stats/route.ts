import { requireAdmin } from '@/lib/auth/authorization';
import { orderService } from '@/services/order.service';
import { ok, internalError } from '@/lib/response';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const stats = await orderService.getAdminDashboardStats();
    return ok(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admin stats';
    return internalError(message);
  }
}
