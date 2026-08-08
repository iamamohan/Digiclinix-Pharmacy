import { NextRequest } from 'next/server';
import { generateProductUploadSignature } from '@/lib/cloudinary';
import { ok } from '@/lib/response';
import { handleApiError } from '@/lib/error';

export async function POST(request: NextRequest) {
  try {
    // Generate server-controlled signed parameters for product image upload
    const uploadParams = generateProductUploadSignature();

    return ok(uploadParams, 'Cloudinary upload signature generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
