// SECURITY: Centralized helpers for API error handling.
// These avoid leaking stack traces or raw Error objects to clients.

import { NextResponse } from "next/server";

export function logApiError(context: string, error: unknown) {
  // In production, send to structured logger or monitoring service
  // In development, console.error is acceptable
  const errorDetails =
    error instanceof Error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        }
      : error;

  console.error(`[API ERROR] ${context}`, errorDetails);
}

export function sanitizeError(error: unknown): string {
  // SECURITY: Never expose raw error details to clients
  if (process.env.NODE_ENV === "production") {
    return "Internal server error";
  }

  // In development, provide more details for debugging
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error occurred";
}

export function internalError(message = "Server Error", status = 500) {
  return NextResponse.json(
    {
      success: false,
      message: process.env.NODE_ENV === "production" ? "Server Error" : message,
    },
    { status },
  );
}

// SECURITY: Validation error helper
export function validationError(message = "Invalid input") {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 400 },
  );
}

// SECURITY: Unauthorized error helper
export function unauthorizedError(message = "Unauthorized") {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 401 },
  );
}

// SECURITY: Forbidden error helper
export function forbiddenError(message = "Forbidden") {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 403 },
  );
}

// SECURITY: Not found error helper
export function notFoundError(message = "Resource not found") {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 404 },
  );
}
