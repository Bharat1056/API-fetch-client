export class HttpError extends Error {
  status: number;
  code: string;
  details?: any;

  constructor(
    message: string,
    status = 500,
    code = "UNKNOWN_ERROR",
    details?: any
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

// predefined errors
export const Errors = {
  BadRequest: (msg = "Bad Request", details?: any) =>
    new HttpError(msg, 400, "BAD_REQUEST", details),

  Unauthorized: (msg = "Unauthorized", details?: any) =>
    new HttpError(msg, 401, "UNAUTHORIZED", details),

  Forbidden: (msg = "Forbidden", details?: any) =>
    new HttpError(msg, 403, "FORBIDDEN", details),

  NotFound: (msg = "Not Found", details?: any) =>
    new HttpError(msg, 404, "NOT_FOUND", details),

  Timeout: (msg = "Request Timeout", details?: any) =>
    new HttpError(msg, 408, "TIMEOUT", details),

  Conflict: (msg = "Conflict", details?: any) =>
    new HttpError(msg, 409, "CONFLICT", details),

  Internal: (msg = "Internal Server Error", details?: any) =>
    new HttpError(msg, 500, "INTERNAL_ERROR", details),

  ServiceUnavailable: (msg = "Service Unavailable", details?: any) =>
    new HttpError(msg, 503, "SERVICE_UNAVAILABLE", details),
};

// usage:
// throw Errors.NotFound();
// throw Errors.BadRequest("Invalid Input");
// throw Errors.Timeout("API took too long", { retryAfter: 5 });
