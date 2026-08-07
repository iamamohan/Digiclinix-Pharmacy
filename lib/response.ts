import { NextResponse } from 'next/server';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...(message ? { message } : {}),
      data,
    },
    { status }
  );
}

export function created<T>(data: T, message?: string) {
  return ok(data, message || 'Resource created successfully', 201);
}

export function paginated<T>(data: T[], page: number, pageSize: number, totalItems: number) {
  const totalPages = Math.ceil(totalItems / pageSize);
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    },
    { status: 200 }
  );
}

export function validationError(message: string, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status: 400 }
  );
}

export function notFound(message = 'Resource not found') {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message,
      },
    },
    { status: 404 }
  );
}

export function conflict(message = 'Resource conflict') {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'CONFLICT',
        message,
      },
    },
    { status: 409 }
  );
}

export function internalError(message = 'An unexpected server error occurred') {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message,
      },
    },
    { status: 500 }
  );
}
