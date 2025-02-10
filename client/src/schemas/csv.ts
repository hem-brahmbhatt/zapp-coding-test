import { z } from 'zod';

export const CsvRowSchema = z.object({
  quantity: z.coerce.number(),
  sku: z.string(),
  description: z.string(),
  store: z.string(),
});

export const CsvSchema = z.array(CsvRowSchema);

export type CsvRow = z.infer<typeof CsvRowSchema>;

export function parseCsvText(text: string): CsvRow[] {
  const rows = text
    .split('\n')
    .slice(1) // Remove header
    .map((line) => {
      const [quantity, sku, description, store] = line.split(',');
      return { quantity, sku, description, store };
    });

  return CsvSchema.parse(rows);
}
