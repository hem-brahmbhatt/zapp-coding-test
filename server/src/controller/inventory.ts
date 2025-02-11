import { ZodError } from 'zod';
import { Request, Response } from 'express';
import { Inventory, InventorySchema } from '../validator/inventory';
import { getDatabase } from '../db';
import { Item } from '../validator/item';

export function createOrUpdateInventory(req: Request, res: Response) {
  try {
    let inventoryList: Item[];

    // Parse the request body
    try {
      inventoryList = InventorySchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: 'Failed to parse request body' });
    }

    // Check for duplicate SKUs within the request
    const skus = inventoryList.map((item) => item.sku);
    const uniqueSkus = new Set(skus);
    if (skus.length !== uniqueSkus.size) {
      return res.status(400).json({ error: 'Request contains duplicate SKUs' });
    }

    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not found' });
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
      console.error(error.message);
    }
    res.status(500).json({ error: 'Failed to create inventory' });
  }
}

export function getInventory(req: Request, res: Response) {
  // The following improvements would be needed to support a real API
  // - Add pagination
  // - Parameterize the order
  // - Add sorting
  // - Add filtering
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not found' });
    }

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
}

export function deleteInventory(req: Request, res: Response) {
  const { sku } = req.params;
  const db = getDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database not found' });
  }

  const deleteItem = db.prepare(`
    DELETE FROM inventory WHERE sku = ?
  `);

  const result = deleteItem.run(sku);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  res.status(200).json({ message: 'Success' });
}

export function updateInventory(req: Request, res: Response) {
  const { sku } = req.params;
  const { quantity, description, store } = req.body;

  let item: Item;

  // Parse the request body
  try {
    item = Item.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).json({ error: 'Failed to parse request body' });
  }

  const db = getDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database not found' });
  }

  const updateItem = db.prepare(`
    UPDATE inventory SET quantity = ?, description = ?, store = ? WHERE sku = ?
  `);

  const result = updateItem.run(quantity, description, store, sku);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  res.status(200).json(item);
}
