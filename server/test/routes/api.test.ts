import Database, { type Database as DatabaseType } from 'better-sqlite3';
import express from 'express';
import request from 'supertest';
import { createApiRouter } from '../../src/routes/api';
import { Inventory } from '../../src/types/inventory';
describe('API Routes', () => {
  let db: DatabaseType;
  let app: express.Application;

  beforeEach(() => {
    // Create a new in-memory database for each test
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quantity INTEGER NOT NULL,
        sku TEXT NOT NULL,
        description TEXT NOT NULL,
        store TEXT NOT NULL
      )
    `);

    // Create a new express app and apply our router
    app = express();
    app.use(express.json());
    app.use('/api', createApiRouter(db));
  });

  afterEach(() => {
    // Clean up database after each test
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
  });

  describe('GET /api/inventory', () => {
    it('should return all inventory items in descending order', async () => {
      // Insert test data
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
