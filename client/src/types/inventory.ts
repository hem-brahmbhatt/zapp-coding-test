import { z } from 'zod';
import { InventoryItem } from './inventoryItem';

export const Inventory = z.array(InventoryItem);
