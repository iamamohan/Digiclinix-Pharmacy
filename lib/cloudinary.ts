import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export const PRODUCT_UPLOAD_FOLDER = 'digiclinix/products';

/**
 * Server-side validation helper to verify if a given public ID is safe and belongs to the products folder.
 */
export function isValidProductPublicId(publicId?: string | null): publicId is string {
  if (!publicId || typeof publicId !== 'string') {
    return false;
  }

  const trimmed = publicId.trim();

  // Must start with allowed folder prefix
  if (!trimmed.startsWith(`${PRODUCT_UPLOAD_FOLDER}/`)) {
    return false;
  }

  // Prevent directory traversal, protocol injection, or query strings
  if (
    trimmed.includes('..') ||
    trimmed.includes('\\') ||
    trimmed.includes('http:') ||
    trimmed.includes('https:') ||
    trimmed.includes('?') ||
    trimmed.includes('#')
  ) {
    return false;
  }

  return true;
}

/**
 * Generates signed parameters for uploading a product image directly to Cloudinary.
 * Enforces folder digiclinix/products.
 */
export function generateProductUploadSignature() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are missing on the server.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = PRODUCT_UPLOAD_FOLDER;

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
}

/**
 * Safely destroys a Cloudinary asset by public ID after verifying ownership and format.
 * Returns true if deletion succeeded, false otherwise.
 */
export async function deleteCloudinaryAsset(publicId?: string | null): Promise<boolean> {
  if (!isValidProductPublicId(publicId)) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok' || result.result === 'not found') {
      return true;
    }
    console.warn(`[Cloudinary] Asset destruction returned non-ok result for ${publicId}:`, result);
    return false;
  } catch (error) {
    console.warn(`[Cloudinary] Non-fatal error deleting asset ${publicId}:`, error);
    return false;
  }
}

export { cloudinary };
