import { z } from 'zod';
import { Item } from './item';

export const CsvSchema = z.array(Item);
