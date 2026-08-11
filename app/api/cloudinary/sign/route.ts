import { NextRequest } from 'next/server';
import { generateProductUploadSignature } from '@/lib/cloudinary';
import { ok } from '@/lib/response';
import { handleApiError } from '@/lib/error';
import { requireAdmin } from '@/lib/auth/authorization';

export async function POST(request: NextRequest) {
  // ADMIN-only: generate Cloudinary upload signature for product images
  const { user: _admin, response: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    // Generate server-controlled signed parameters for product image upload
    const uploadParams = generateProductUploadSignature();

    return ok(uploadParams, 'Cloudinary upload signature generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
