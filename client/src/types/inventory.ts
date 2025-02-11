import { z } from 'zod';
import { Item } from './item';

export const Inventory = z.array(Item);
