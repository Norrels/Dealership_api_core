import { int, sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const vehicle = sqliteTable("vehicle_table", {
  id: int().primaryKey({ autoIncrement: true }),
  make: text().notNull(),
  model: text().notNull(),
  year: int().notNull(),
  vin: text().notNull(),
  color: text().notNull(),
  price: real().notNull(),
  isSold: integer({ mode: "boolean" }).notNull(),
});
