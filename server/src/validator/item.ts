import { z } from 'zod';

export const Item = z.object({
  quantity: z.coerce.number(), // parse quantity as a number
  sku: z.string().regex(/^[A-Za-z]{2}-\d{4}$/, 'SKU must be in the format AA-0000'),
  description: z.string(),
  store: z.string(),
});

export type Item = z.infer<typeof Item>;
