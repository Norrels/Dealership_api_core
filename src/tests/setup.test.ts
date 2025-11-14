import { beforeAll } from "bun:test";
import { db } from "@/infra/database";
import { vehicleSchema } from "@/infra/database/schemas/vehicle-schemas";
import { config } from "@/config/env";

beforeAll(async () => {
  config.LOG_LEVEL = "silent";

  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not configured. Using default database.");
    console.warn("It's recommended to set DATABASE_URL in your environment.");
  }
});


export const cleanDatabase = async () => {
  await db.delete(vehicleSchema);
};
