// Typed errors for the service layer. Route handlers and Server Actions
// catch these and translate them into human-readable messages — raw
// database errors are never surfaced to the UI (see docs/API.md §"Error
// Handling Contract").

export class ValidationError extends Error {
  readonly fieldErrors?: Record<string, string[]>;
  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export type ErrorResponse = { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Convert any thrown error into a safe, human-readable API response plus an
 * HTTP status code. Unknown/unexpected errors are logged server-side and
 * given a generic message — never surfaced verbatim to the client.
 */
export function toErrorResponse(error: unknown): { status: number; body: ErrorResponse } {
  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: { success: false, error: error.message, fieldErrors: error.fieldErrors },
    };
  }
  if (error instanceof NotFoundError) {
    return { status: 404, body: { success: false, error: error.message } };
  }
  if (error instanceof ConflictError) {
    return { status: 409, body: { success: false, error: error.message } };
  }

  console.error(error);
  return {
    status: 500,
    body: { success: false, error: "Something went wrong. Please try again." },
  };
}
