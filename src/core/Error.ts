import { STATUS_CODES, STATUS_TEXTS } from '../constants/status';

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
    new HttpError(msg, STATUS_CODES.BAD_REQUEST, STATUS_TEXTS.BAD_REQUEST, details),

  Unauthorized: (msg = "Unauthorized", details?: any) =>
    new HttpError(msg, STATUS_CODES.UNAUTHORIZED, STATUS_TEXTS.UNAUTHORIZED, details),

  Forbidden: (msg = "Forbidden", details?: any) =>
    new HttpError(msg, STATUS_CODES.FORBIDDEN, STATUS_TEXTS.FORBIDDEN, details),

  NotFound: (msg = "Not Found", details?: any) =>
    new HttpError(msg, STATUS_CODES.NOT_FOUND, STATUS_TEXTS.NOT_FOUND, details),

  Timeout: (msg = "Request Timeout", details?: any) =>
    new HttpError(msg, STATUS_CODES.TIMEOUT, STATUS_TEXTS.TIMEOUT, details),

  Conflict: (msg = "Conflict", details?: any) =>
    new HttpError(msg, STATUS_CODES.CONFLICT, STATUS_TEXTS.CONFLICT, details),

  Internal: (msg = "Internal Server Error", details?: any) =>
    new HttpError(msg, STATUS_CODES.CONFLICT, STATUS_TEXTS.INTERNAL_SERVER_ERROR, details),

  ServiceUnavailable: (msg = "Service Unavailable", details?: any) =>
    new HttpError(msg, STATUS_CODES.CONFLICT, STATUS_TEXTS.SERVICE_UNAVAILABLE, details),
};

// usage:
// throw Errors.NotFound();
// throw Errors.BadRequest("Invalid Input");
// throw Errors.Timeout("API took too long", { retryAfter: 5 });
