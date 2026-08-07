import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { validationError, notFound, conflict, internalError } from '@/lib/response';

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return validationError('Validation failed', details);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Prisma Known Error]', { code: error.code, meta: error.meta, message: error.message });
    }
    if (error.code === 'P2025') {
      return notFound('Requested resource was not found');
    }
    if (error.code === 'P2002') {
      return conflict('A resource with this unique constraint already exists');
    }
  }

  // Prisma initialization error — typically missing DATABASE_URL or bad connection string
  if (error instanceof Prisma.PrismaClientInitializationError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Prisma Init Error] Database connection failed. Check DATABASE_URL in .env:', error.message);
    }
    return internalError('Database connection failed. Check server configuration.');
  }

  // Prisma validation error (e.g. invalid field names / query structure)
  if (error instanceof Prisma.PrismaClientValidationError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Prisma Validation Error]', error.message);
    }
    return internalError('Invalid database query. Check server logs for details.');
  }

  // Catch all unexpected errors with full stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error] Unexpected error:', error);
    if (error instanceof Error) {
      console.error('[Stack Trace]:', error.stack);
    }
  } else {
    // Production: log sanitized error reference only
    console.error('[API Error]:', error instanceof Error ? error.message : String(error));
  }

  return internalError('An unexpected server error occurred');
}
