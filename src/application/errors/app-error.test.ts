import { describe, it, expect } from "bun:test";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError,
  ServiceUnavailableError,
} from "@/application/errors";

describe("AppError Classes - Unit Tests", () => {
  describe("BadRequestError", () => {
    it("should create error with correct properties", () => {
      const error = new BadRequestError("Invalid input");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Invalid input");
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe("BadRequestError");
      expect(error.isOperational).toBe(true);
    });

    it("should use default message when not provided", () => {
      const error = new BadRequestError();

      expect(error.message).toBe("Bad Request");
      expect(error.statusCode).toBe(400);
    });
  });

  describe("UnauthorizedError", () => {
    it("should create error with correct properties", () => {
      const error = new UnauthorizedError("Not authenticated");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Not authenticated");
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe("UnauthorizedError");
      expect(error.isOperational).toBe(true);
    });

    it("should use default message when not provided", () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe("Unauthorized");
    });
  });

  describe("ForbiddenError", () => {
    it("should create error with correct properties", () => {
      const error = new ForbiddenError("Access denied");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Access denied");
      expect(error.statusCode).toBe(403);
      expect(error.name).toBe("ForbiddenError");
      expect(error.isOperational).toBe(true);
    });

    it("should use default message when not provided", () => {
      const error = new ForbiddenError();

      expect(error.message).toBe("Forbidden");
    });
  });

  describe("NotFoundError", () => {
    it("should create error with correct properties", () => {
      const error = new NotFoundError("Vehicle not found");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Vehicle not found");
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe("NotFoundError");
      expect(error.isOperational).toBe(true);
    });

    it("should use default message when not provided", () => {
      const error = new NotFoundError();

      expect(error.message).toBe("Resource not found");
    });
  });

  describe("ConflictError", () => {
    it("should create error with correct properties", () => {
      const error = new ConflictError("VIN already exists");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("VIN already exists");
      expect(error.statusCode).toBe(409);
      expect(error.name).toBe("ConflictError");
      expect(error.isOperational).toBe(true);
    });

    it("should use default message when not provided", () => {
      const error = new ConflictError();

      expect(error.message).toBe("Conflict");
    });
  });

  describe("UnprocessableEntityError", () => {
    it("should create error with correct properties", () => {
      const error = new UnprocessableEntityError("Invalid data format");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Invalid data format");
      expect(error.statusCode).toBe(422);
      expect(error.name).toBe("UnprocessableEntityError");
      expect(error.isOperational).toBe(true);
    });

    it("should use default message when not provided", () => {
      const error = new UnprocessableEntityError();

      expect(error.message).toBe("Unprocessable Entity");
    });
  });

  describe("InternalServerError", () => {
    it("should create error with correct properties", () => {
      const error = new InternalServerError("Database connection failed");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Database connection failed");
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe("InternalServerError");
      expect(error.isOperational).toBe(false);
    });

    it("should use default message when not provided", () => {
      const error = new InternalServerError();

      expect(error.message).toBe("Internal Server Error");
    });

    it("should be marked as non-operational", () => {
      const error = new InternalServerError();

      expect(error.isOperational).toBe(false);
    });
  });

  describe("ServiceUnavailableError", () => {
    it("should create error with correct properties", () => {
      const error = new ServiceUnavailableError("Service is down");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Service is down");
      expect(error.statusCode).toBe(503);
      expect(error.name).toBe("ServiceUnavailableError");
      expect(error.isOperational).toBe(false); 
    });

    it("should use default message when not provided", () => {
      const error = new ServiceUnavailableError();

      expect(error.message).toBe("Service Unavailable");
    });

    it("should be marked as non-operational", () => {
      const error = new ServiceUnavailableError();

      expect(error.isOperational).toBe(false);
    });
  });

  describe("Error Inheritance", () => {
    it("should maintain prototype chain for instanceof checks", () => {
      const errors = [
        new BadRequestError(),
        new UnauthorizedError(),
        new ForbiddenError(),
        new NotFoundError(),
        new ConflictError(),
        new UnprocessableEntityError(),
        new InternalServerError(),
        new ServiceUnavailableError(),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
      });
    });

    it("should have stack trace", () => {
      const error = new NotFoundError("Test error");

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
      expect(error.stack).toContain("NotFoundError");
    });
  });

  describe("Error Throwing and Catching", () => {
    it("should be catchable with try-catch", () => {
      expect(() => {
        throw new NotFoundError("Test");
      }).toThrow(NotFoundError);
    });

    it("should preserve error message when thrown", () => {
      const testMessage = "Custom error message";

      try {
        throw new ConflictError(testMessage);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
        expect((error as ConflictError).message).toBe(testMessage);
      }
    });

    it("should preserve status code when thrown", () => {
      try {
        throw new NotFoundError("Not found");
      } catch (error) {
        expect((error as NotFoundError).statusCode).toBe(404);
      }
    });
  });

  describe("Operational vs Non-Operational Errors", () => {
    it("should mark client errors as operational", () => {
      const operationalErrors = [
        new BadRequestError(),
        new UnauthorizedError(),
        new ForbiddenError(),
        new NotFoundError(),
        new ConflictError(),
        new UnprocessableEntityError(),
      ];

      operationalErrors.forEach((error) => {
        expect(error.isOperational).toBe(true);
      });
    });

    it("should mark server errors as non-operational", () => {
      const nonOperationalErrors = [
        new InternalServerError(),
        new ServiceUnavailableError(),
      ];

      nonOperationalErrors.forEach((error) => {
        expect(error.isOperational).toBe(false);
      });
    });
  });
});
