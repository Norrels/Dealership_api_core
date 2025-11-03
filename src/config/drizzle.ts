import { defineConfig } from "drizzle-kit";
import { config } from "./env";

export default defineConfig({
  out: "./src/infra/database/drizzle",
  schema: "./src/infra/database/schemas/*",
  dialect: "sqlite",
  dbCredentials: {
    url: config.DB_FILE_NAME,
  },
});
