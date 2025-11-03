import { defineConfig } from "drizzle-kit";
import { config } from "./env";

export default defineConfig({
  out: "./src/infra/database/drizzle",
  schema: "./src/infra/database/schemas/*",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
