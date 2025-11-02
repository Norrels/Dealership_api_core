import { Elysia } from "elysia";
import { AppError } from "../errors";

interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
  };
}

export const errorHandler = new Elysia().onError(
  ({ code, error, set, request }) => {
    const timestamp = new Date().toISOString();
    const path = new URL(request.url).pathname;

    if (error instanceof AppError) {
      set.status = error.statusCode;

      const response: ErrorResponse = {
        error: {
          message: error.message,
          statusCode: error.statusCode,
          timestamp,
          path,
        },
      };

      return response;
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: {
          message: "Validation failed",
          statusCode: 400,
          timestamp,
          path,
          details: error.message,
        },
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: {
          message: "Route not found",
          statusCode: 404,
          timestamp,
          path,
        },
      };
    }

    if (code === "PARSE") {
      set.status = 400;
      return {
        error: {
          message: "Invalid request format",
          statusCode: 400,
          timestamp,
          path,
        },
      };
    }

    console.error("Unhandled error:", {
      code,
      error: error,
    });

    set.status = 500;
    return {
      error: {
        message: "Internal server error",
        statusCode: 500,
        timestamp,
        path,
      },
    };
  }
);
