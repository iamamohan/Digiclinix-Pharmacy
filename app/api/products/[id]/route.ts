import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { ok, notFound } from '@/lib/response';
import { handleApiError } from '@/lib/error';
import { productIdParamSchema, updateProductSchema } from '@/lib/validations/product.schema';
import { requireAdmin } from '@/lib/auth/authorization';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sanitizedId = productIdParamSchema.parse(id);

    const product = await productService.getByIdOrSlug(sanitizedId);

    if (!product) {
      return notFound('Product not found');
    }

    return ok(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ADMIN-only: update product
  const { user: _admin, response: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const sanitizedId = productIdParamSchema.parse(id);

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const updatedProduct = await productService.update(sanitizedId, validatedData);

    if (!updatedProduct) {
      return notFound('Product not found');
    }

    return ok(updatedProduct, 'Product updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ADMIN-only: delete product
  const { user: _admin, response: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const sanitizedId = productIdParamSchema.parse(id);

    const removed = await productService.remove(sanitizedId);

    if (!removed) {
      return notFound('Product not found');
    }

    return ok({ message: 'Product deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
