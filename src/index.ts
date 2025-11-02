import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { VehicleController } from "./application/controller/vehicle-controller";
import { errorHandler } from "./application/middlewares/error-handler";

const app = new Elysia()
  .use(errorHandler)
  .use(
    openapi({
      documentation: {
        info: {
          title: "Dealership Vehicle Management API",
          version: "1.0.0",
          description: "API for managing vehicles in a dealership system.",
        },
        tags: [
          {
            name: "Health",
            description: "Health check endpoints",
          },
          {
            name: "Vehicles",
            description: "Endpoints for managing vehicles",
          },
        ],
      },
    })
  )
  .get("/health", () => "ok", {
    detail: {
      tags: ["Health"],
      summary: "Health check",
      description: "Returns 'ok' if the service is running",
    },
  })
  .use(VehicleController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
