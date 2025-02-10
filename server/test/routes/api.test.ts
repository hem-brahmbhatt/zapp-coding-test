import type { Database } from 'better-sqlite3';
import express from 'express';
import request from 'supertest';
import { createApiRouter } from '../../src/routes/api';
import { Inventory } from '../../src/types/inventory';
import { createDatabase } from '../../src/db';

describe('API Routes', () => {
  let db: Database;
  let app: express.Application;

  beforeEach(() => {
    db = createDatabase();

    app = express();
    app.use(express.json());
    app.use('/api', createApiRouter(db));
  });

  afterEach(() => {
    db.close();
  });

  describe('POST /api/inventory', () => {
    it('should create new inventory items', async () => {
      const inventoryData = [
        {
          quantity: 10,
          sku: 'ABC123',
          description: 'Test Item 1',
          store: 'Store A',
        },
        {
          quantity: 20,
          sku: 'XYZ789',
          description: 'Test Item 2',
          store: 'Store B',
        },
      ];

      const response = await request(app).post('/api/inventory').send(inventoryData).expect(201);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: 1,
        ...inventoryData[0],
      });
      expect(response.body[1]).toMatchObject({
        id: 2,
        ...inventoryData[1],
      });
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = [
        {
          quantity: 'not a number',
          sku: 'ABC123',
          description: 'Test Item',
          store: 'Store A',
        },
      ];

      await request(app).post('/api/inventory').send(invalidData).expect(400);
    });

    it('should return 400 for empty array', async () => {
      const invalidData: Inventory = [];

      await request(app).post('/api/inventory').send(invalidData).expect(400);
    });

    it('should return 400 for requst with duplicate SKUs', async () => {
      const duplicateItems = [
        {
          sku: 'ABC123',
          quantity: 5,
          description: 'First item',
          store: 'Store A',
        },
        {
          sku: 'ABC123',
          quantity: 10,
          description: 'Second item',
          store: 'Store B',
        },
      ];

      const response = await request(app).post('/api/inventory').send(duplicateItems);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/duplicate.*sku/i);
    });

    it('should update item when SKU already exists in database', async () => {
      const item = {
        quantity: 5,
        sku: 'ABC123',
        description: 'Item',
        store: 'Store A',
      };

      await request(app).post('/api/inventory').send([item]).expect(201);

      const updatedItem = {
        ...item,
        description: 'Updated Item',
      };

      const response = await request(app).post('/api/inventory').send([updatedItem]);

      expect(response.body[0]).toMatchObject({
        id: 1,
        ...updatedItem,
      });

      const getResponse = await request(app).get('/api/inventory');
      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0]).toMatchObject({
        id: 1,
        ...updatedItem,
      });
    });
  });

  describe('GET /api/inventory', () => {
    it('should return all inventory items in descending order', async () => {
      const testData = [
        { quantity: 10, sku: 'TEST1', description: 'Item 1', store: 'Store A' },
        { quantity: 20, sku: 'TEST2', description: 'Item 2', store: 'Store B' },
      ];

      const insert = db.prepare(`
        INSERT INTO inventory (quantity, sku, description, store)
        VALUES (?, ?, ?, ?)
      `);

      testData.forEach((item) => {
        insert.run(item.quantity, item.sku, item.description, item.store);
      });

      const response = await request(app).get('/api/inventory').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toMatchObject([
        {
          id: 2,
          ...testData[1],
        },
        {
          id: 1,
          ...testData[0],
        },
      ]);
    });
  });
});
