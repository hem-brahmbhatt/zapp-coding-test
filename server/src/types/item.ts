import { z } from 'zod';

export const Item = z.object({
  quantity: z.coerce.number(), // parse quantity as a number
  sku: z.string(),
  description: z.string(),
  store: z.string(),
});

export type Item = z.infer<typeof Item>;
