import { z } from 'zod';
import { Item } from './item';

export const InventorySchema = z.array(Item).min(1, 'Inventory must contain at least one item');

export type Inventory = z.infer<typeof InventorySchema>;
