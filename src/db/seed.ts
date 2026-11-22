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
}));
