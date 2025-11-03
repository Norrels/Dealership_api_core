import { Elysia } from "elysia";
import { logger } from "@/config/logger";

export const requestLogger = new Elysia({ name: "request-logger" })
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    logger.info(
      {
        method: request.method,
        path: url.pathname,
        url: request.url,
      },
      `${request.method} ${url.pathname}`
    );
  })
  .onAfterHandle(({ request, set }) => {
    const url = new URL(request.url);
    logger.info(
      {
        method: request.method,
        path: url.pathname,
        statusCode: set.status,
      },
      `${request.method} ${url.pathname} - ${set.status}`
    );
  });
