import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { VehicleController } from "./application/controller/vehicle-controller";
import { errorHandler } from "./application/middlewares/error-handler";
import { requestLogger } from "./application/middlewares/logger";
import { logger } from "./config/logger";
import { openapiConfig } from "./config/openapi";

const app = new Elysia()
  .use(requestLogger)
  .use(errorHandler)
  .use(openapiConfig)
  .get("/health", () => "ok", {
    detail: {
      tags: ["Health"],
      summary: "Health check",
      description: "Returns 'ok' if the service is running",
    },
  })
  .use(VehicleController)
  .listen(3000);

logger.info(
  {
    hostname: app.server?.hostname,
    port: app.server?.port,
  },
  `Elysia server started at ${app.server?.hostname}:${app.server?.port}`
);
