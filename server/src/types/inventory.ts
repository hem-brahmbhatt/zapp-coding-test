import { z } from 'zod';
import { Item } from './item';

export const InventorySchema = z.array(Item);

export type Inventory = z.infer<typeof InventorySchema>;
