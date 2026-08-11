import { NextRequest } from 'next/server';
import { verifyEmailOTP } from '@/lib/auth/otp';
import { ok, validationError } from '@/lib/response';
import { handleApiError } from '@/lib/error';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body?.email;
    const otp = body?.otp;

    if (!email || typeof email !== 'string' || !otp || typeof otp !== 'string') {
      return validationError('Invalid or expired verification code.');
    }

    const result = await verifyEmailOTP(email, otp);

    if (!result.success) {
      return validationError(result.error || 'Invalid or expired verification code.');
    }

    return ok(
      { email: email.toLowerCase().trim() },
      'Email verified successfully. You can now log in.'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
