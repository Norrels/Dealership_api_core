export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable Entity") {
    super(message, 422);
    this.name = "UnprocessableEntityError";
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500, false);
    this.name = "InternalServerError";
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "Service Unavailable") {
    super(message, 503, false);
    this.name = "ServiceUnavailableError";
  }
}