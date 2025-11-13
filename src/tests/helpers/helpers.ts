import { Elysia } from "elysia";
import { VehicleController } from "@/application/controller/vehicle-controller";
import { AppError } from "@/application/errors";


export function createTestApp() {
  const app = new Elysia();

  app.onError(({ error, set, code }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        error: {
          message: error.message,
          statusCode: error.statusCode,
          timestamp: new Date().toISOString(),
        },
      };
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        error: {
          message: "Validation failed",
          statusCode: 422,
          timestamp: new Date().toISOString(),
          details: error.message,
        },
      };
    }

    set.status = 500;
    return {
      error: {
        message: "Internal server error",
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
    };
  });

  app.use(VehicleController);

  return app;
}


export async function makeRequest(
  app: Elysia,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: any
) {
  const request = new Request(`http://localhost${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return app.handle(request);
}
