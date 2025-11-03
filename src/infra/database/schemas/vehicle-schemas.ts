import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const vehicleSchema = pgTable(
  "vehicle_table",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    make: varchar({ length: 255 }).notNull(),
    model: varchar().notNull(),
    year: integer("year").notNull(),
    vin: varchar().notNull(),
    color: varchar().notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    isSold: boolean("is_sold").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("vin_unique_idx").on(table.vin)]
);
