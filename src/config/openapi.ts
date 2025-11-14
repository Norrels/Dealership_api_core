import openapi from "@elysiajs/openapi";

export const openapiConfig = openapi({
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