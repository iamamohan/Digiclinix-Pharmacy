import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signupSchema } from '@/lib/validations/auth.schema';
import { created, conflict } from '@/lib/response';
import { handleApiError } from '@/lib/error';
import bcrypt from 'bcryptjs';

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

    // Create user in Neon database via Prisma
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name.trim(),
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return created(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      'Account created successfully. You can now log in.'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
