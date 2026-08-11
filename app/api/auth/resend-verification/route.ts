import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateEmailOTP, invalidateEmailOTP } from '@/lib/auth/otp';
import { sendVerificationOTPEmail } from '@/lib/email';
import { ok, validationError } from '@/lib/response';
import { handleApiError } from '@/lib/error';
import { checkResendCooldown, setResendCooldown } from '@/lib/auth/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = body?.email;

    if (!rawEmail || typeof rawEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail.trim())) {
      return validationError('Please provide a valid email address.');
    }

    const email = rawEmail.toLowerCase().trim();

    // Check rate limiting cooldown (60s)
    const { allowed, remainingSeconds } = checkResendCooldown(email);
    if (!allowed) {
      return validationError(
        `Please wait ${remainingSeconds} seconds before requesting another verification code.`
      );
    }

    // Set rate-limit timestamp
    setResendCooldown(email);

    // Uniform generic message to prevent account enumeration
    const genericResponseMessage =
      'If an account with this email exists and requires verification, a new verification code has been sent.';

    // Look up user in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        passwordHash: true,
      },
    });

    // Guard: Skip OTP generation for non-existent users, already verified users, or Google OAuth-only accounts (no passwordHash)
    if (!user || user.emailVerified || !user.passwordHash) {
      return ok({ sent: true }, genericResponseMessage);
    }

    // Generate new OTP (invalidates any existing active OTPs for this email)
    const { rawOtp } = await generateEmailOTP(email);

    // Send OTP email
    const emailResult = await sendVerificationOTPEmail({
      email: user.email!,
      name: user.name,
      otp: rawOtp,
    });

    // Handle email delivery failure: delete undelivered OTP
    if (!emailResult.success) {
      await invalidateEmailOTP(email);
    }

    return ok({ sent: true }, genericResponseMessage);
  } catch (error) {
    return handleApiError(error);
  }
}
