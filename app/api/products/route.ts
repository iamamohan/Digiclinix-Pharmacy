import { NextRequest } from 'next/server';
import { getProductsQuerySchema, createProductSchema } from '@/lib/validations/product.schema';
import { productService } from '@/services/product.service';
import { paginated, created } from '@/lib/response';
import { handleApiError } from '@/lib/error';
import { requireAdmin } from '@/lib/auth/authorization';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const validatedQuery = getProductsQuerySchema.parse(searchParams);

    const { products, page, pageSize, totalItems } = await productService.list(validatedQuery);

    return paginated(products, page, pageSize, totalItems);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  // ADMIN-only: create product
  const { user: _admin, response: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    const newProduct = await productService.create(validatedData);

    return created(newProduct, 'Product created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
