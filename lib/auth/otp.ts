import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

/**
 * Generates a cryptographically secure 6-digit numeric OTP with leading-zero support.
 * Example: "004281" or "482913"
 */
export function generateNumericOTP(): string {
  const numericVal = crypto.randomInt(0, 1000000);
  return String(numericVal).padStart(6, '0');
}

/**
 * Deletes any existing OTP records for the specified email address.
 */
export async function invalidateEmailOTP(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  await prisma.emailVerificationOTP.deleteMany({
    where: { email: normalizedEmail },
  });
}

/**
 * Generates a new 6-digit OTP, deletes previous active OTPs for the email,
 * hashes the OTP using bcrypt, sets 10-minute expiration, and saves to database.
 * Returns the raw 6-digit OTP ONLY for sending via server-side email service.
 */
export async function generateEmailOTP(email: string): Promise<{ rawOtp: string; expiresAt: Date }> {
  const normalizedEmail = email.toLowerCase().trim();
  const rawOtp = generateNumericOTP();
  const codeHash = await bcrypt.hash(rawOtp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete any pre-existing OTP records for this email
  await invalidateEmailOTP(normalizedEmail);

  // Save hashed OTP in database
  await prisma.emailVerificationOTP.create({
    data: {
      email: normalizedEmail,
      codeHash,
      expiresAt,
      attempts: 0,
    },
  });

  return { rawOtp, expiresAt };
}

/**
 * Verifies a 6-digit OTP against stored bcrypt hash for a given email address.
 * Enforces 10-minute expiry, maximum 5 verification attempts, and concurrency safety.
 *
 * Behavior:
 * - Compares bcrypt hash outside transaction to optimize DB locking.
 * - Incorrect attempt: Increments attempts. Invalidates/deletes OTP after 5th failed attempt.
 * - Correct attempt: Atomically verifies user (emailVerified = now()) and deletes OTP in a transaction.
 * - Returns uniform generic error "Invalid or expired verification code." on failure.
 */
export async function verifyEmailOTP(
  email: string,
  suppliedOtp: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  const sanitizedOtp = suppliedOtp ? suppliedOtp.trim() : '';

  // Validate email format and 6-digit numeric OTP format
  if (!normalizedEmail || !/^\d{6}$/.test(sanitizedOtp)) {
    return { success: false, error: 'Invalid or expired verification code.' };
  }

  // Retrieve active OTP record for email
  const otpRecord = await prisma.emailVerificationOTP.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    return { success: false, error: 'Invalid or expired verification code.' };
  }

  // Expiration check (10 minutes)
  const isExpired = new Date(otpRecord.expiresAt) < new Date();
  if (isExpired) {
    await invalidateEmailOTP(normalizedEmail);
    return { success: false, error: 'Invalid or expired verification code.' };
  }

  // Attempt limit check (maximum 5 attempts)
  if (otpRecord.attempts >= 5) {
    await invalidateEmailOTP(normalizedEmail);
    return { success: false, error: 'Invalid or expired verification code.' };
  }

  // Perform computational bcrypt comparison outside transaction
  const isMatch = await bcrypt.compare(sanitizedOtp, otpRecord.codeHash);

  if (!isMatch) {
    const newAttempts = otpRecord.attempts + 1;
    if (newAttempts >= 5) {
      // Maximum 5 failed attempts reached -> delete/invalidate OTP immediately
      await invalidateEmailOTP(normalizedEmail);
    } else {
      // Increment attempt counter
      await prisma.emailVerificationOTP.update({
        where: { id: otpRecord.id },
        data: { attempts: newAttempts },
      });
    }
    return { success: false, error: 'Invalid or expired verification code.' };
  }

  // OTP is correct! Execute atomic transaction for Concurrency Safety & Single-Use Guarantee
  try {
    const transactionResult = await prisma.$transaction(async (tx) => {
      // Re-verify that OTP record still exists (prevents race condition across concurrent requests)
      const currentOtp = await tx.emailVerificationOTP.findUnique({
        where: { id: otpRecord.id },
      });

      if (!currentOtp) {
        return false;
      }

      // Find user
      const user = await tx.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        return false;
      }

      // Atomically update emailVerified timestamp and delete OTP record
      await tx.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      await tx.emailVerificationOTP.delete({
        where: { id: otpRecord.id },
      });

      return true;
    });

    if (!transactionResult) {
      return { success: false, error: 'Invalid or expired verification code.' };
    }

    return { success: true };
  } catch (txError) {
    console.error('[OTP Verification Tx Error]:', txError);
    return { success: false, error: 'Invalid or expired verification code.' };
  }
}
