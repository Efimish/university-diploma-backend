import { reset, seed } from "drizzle-seed";
import { db, schema } from ".";

// await reset(db, schema);
await seed(db, schema).refine((f) => ({
  crops: {
    count: 10,
    columns: {
      title: f.country(),
      internalPricePerKg: f.int({ minValue: 50, maxValue: 500 }),
      externalPricePerKg: f.int({ minValue: 60, maxValue: 600 }),
    },
  },
  employees: {
    count: 20,
    columns: {
      role: f.valuesFromArray({
        values: ["сборщик", "тракторист", "бригадир", "агроном"],
      }),
      type: f.valuesFromArray({
        values: [
          {
            values: ["постоянный"],
            weight: 0.8,
          },
          {
            values: ["временный"],
            weight: 0.2,
          },
        ],
      }),
    },
  },
  users: {
    count: 3,
  },
}));
