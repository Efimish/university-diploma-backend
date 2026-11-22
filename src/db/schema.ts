import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const crops = pgTable("crops", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().unique().notNull(),
  internalPricePerKg: integer().notNull(),
  externalPricePerKg: integer().notNull(),
});

export const employees = pgTable("employees", {
  id: uuid().defaultRandom().primaryKey(),
  role: text({
    enum: ["сборщик", "тракторист", "бригадир", "агроном"],
  }).notNull(),
  name: text().notNull(),
  type: text({ enum: ["постоянный", "временный"] }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  employeeId: uuid()
    .references(() => employees.id)
    .notNull(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
});

export const weighingEmployees = pgTable("weighing_employees", {
  id: uuid().defaultRandom().primaryKey(),
  cropId: uuid()
    .references(() => crops.id)
    .notNull(),
  employeeId: uuid()
    .references(() => employees.id)
    .notNull(),
  weightNettoGrams: integer().array().notNull(),
  weightContainersGrams: integer().array().notNull(),
  time: timestamp().defaultNow().notNull(),
  price: integer().notNull(), // денормализация (в случае если цена изменится)
});

export const weighingClients = pgTable("weighing_clients", {
  id: uuid().defaultRandom().primaryKey(),
  cropId: uuid()
    .references(() => crops.id)
    .notNull(),
  name: text().notNull(),
  weightNettoGrams: integer().array().notNull(),
  weightContainersGrams: integer().array().notNull(),
  time: timestamp().defaultNow().notNull(),
  price: integer().notNull(), // денормализация (в случае если цена изменится)
  paymentType: text({ enum: ["cash", "card", "qr"] }).notNull(),
});
