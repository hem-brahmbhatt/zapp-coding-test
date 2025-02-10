import { Router, Request, Response } from 'express';
import type { Database } from 'better-sqlite3';
import { Inventory, InventorySchema } from '../types/inventory';

export const createApiRouter = (db: Database) => {
  const router = Router();

  router.post('/inventory', (req: Request, res: Response) => {
    try {
      const inventoryList = InventorySchema.parse(req.body);

      const insert = db.prepare(`
        INSERT INTO inventory (quantity, sku, description, store)
        VALUES (?, ?, ?, ?)
      `);

      const insertAll = db.transaction((items: Inventory) => {
        const results = items.map((item) =>
          insert.run(item.quantity, item.sku, item.description, item.store)
        );
        return results;
      });

      const results = insertAll(inventoryList);

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
