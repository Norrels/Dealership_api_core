import "dotenv/config";
import { config } from "@/config/env";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(config.DATABASE_URL);
