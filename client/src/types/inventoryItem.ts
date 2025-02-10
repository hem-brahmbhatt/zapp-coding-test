import { z } from 'zod';

export const InventoryItem = z.object({
  id: z.number(),
  quantity: z.coerce.number(),
  sku: z.string(),
  description: z.string(),
  store: z.string(),
});

export type InventoryItem = z.infer<typeof InventoryItem>;
