import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signupSchema } from '@/lib/validations/auth.schema';
import { created, conflict, internalError } from '@/lib/response';
import { handleApiError } from '@/lib/error';
import bcrypt from 'bcryptjs';
import { generateEmailOTP, invalidateEmailOTP } from '@/lib/auth/otp';
import { sendVerificationOTPEmail } from '@/lib/email';
import { setResendCooldown } from '@/lib/auth/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    const email = validatedData.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return conflict('An account with this email already exists. Please log in.');
    }

    // Secure password hashing (salt rounds: 10)
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // Create user in Neon database via Prisma with emailVerified = null
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name.trim(),
        email,
        passwordHash,
        emailVerified: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate secure 6-digit OTP and store bcrypt hash in database
    const { rawOtp } = await generateEmailOTP(email);

    // Set 60-second cooldown timestamp starting from initial signup email
    setResendCooldown(email);

    // Send OTP email via Resend
    const emailResult = await sendVerificationOTPEmail({
      email: newUser.email!,
      name: newUser.name,
      otp: rawOtp,
    });

    // Handle email delivery failure: Invalidate newly stored OTP so no undelivered OTP remains in DB
    if (!emailResult.success) {
      await invalidateEmailOTP(email);
      return internalError('Failed to send verification email. Please try again later.');
    }

    return created(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      'Account created successfully. Please check your email for your 6-digit verification code.'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
