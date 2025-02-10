import { Router, Request, Response } from 'express';
import type { Database } from 'better-sqlite3';
import { Inventory, InventorySchema } from '../types/inventory';

export const createApiRouter = (db: Database) => {
  const router = Router();

  router.post('/inventory', (req: Request, res: Response) => {
    try {
      const inventoryList = InventorySchema.parse(req.body);

      // Check for duplicate SKUs within the request
      const skus = inventoryList.map((item) => item.sku);
      const uniqueSkus = new Set(skus);
      if (skus.length !== uniqueSkus.size) {
        return res.status(400).json({ error: 'Request contains duplicate SKUs' });
      }

      // We use ON CONFLICT to update the quantity if the SKU already exists
      // See https://www.prisma.io/dataguide/postgresql/inserting-and-modifying-data/insert-on-conflict
      const insert = db.prepare(`
        INSERT INTO inventory (quantity, sku, description, store)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (sku) DO UPDATE SET
          quantity = EXCLUDED.quantity,
          description = EXCLUDED.description,
          store = EXCLUDED.store
      `);

      const insertMany = db.transaction((items: Inventory) => {
        const results = items.map((item) =>
          insert.run(item.quantity, item.sku, item.description, item.store)
        );
        return results;
      });

      const results = insertMany(inventoryList);

      const insertedItems = inventoryList.map((item, index) => ({
        id: results[index].lastInsertRowid,
        ...item,
      }));

      res.status(201).json(insertedItems);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create inventory' });
      }
    }
  });

  router.get('/inventory', (_: Request, res: Response) => {
    // The following improvements would be needed to support a real API
    // - Add pagination
    // - Parameterize the order
    // - Add sorting
    // - Add filtering
    try {
      const select = db.prepare(`
        SELECT id, quantity, sku, description, store
        FROM inventory
        ORDER BY id DESC
      `);

      const inventory = select.all();
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  return router;
};
