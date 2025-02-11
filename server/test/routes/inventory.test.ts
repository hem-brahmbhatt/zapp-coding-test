import express from 'express';
import request from 'supertest';
import { createInventoryRouter } from '../../src/routes/inventory';
import { Inventory } from '../../src/validator/inventory';
import { resetDatabase, closeDatabase } from '../../src/db';

describe('API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    resetDatabase();

    app = express();
    app.use(express.json());
    app.use('/api', createInventoryRouter());
  });

  afterEach(() => {
    closeDatabase();
  });

  describe('POST /api/inventory', () => {
    it('should create new inventory items', async () => {
      const inventoryData = [
        {
          quantity: 10,
          sku: 'UK-1011',
          description: 'Test Item 1',
          store: 'Store A',
        },
        {
          quantity: 20,
          sku: 'UK-1012',
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

    it('should return 400 for invalid SKU', async () => {
      const invalidData = [
        {
          quantity: 1,
          sku: 'invalid SKU',
          description: 'Test Item',
          store: 'Store A',
        },
      ];

      const response = await request(app).post('/api/inventory').send(invalidData).expect(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/sku/i);
    });

    it('should return 400 for empty array', async () => {
      const invalidData: Inventory = [];

      await request(app).post('/api/inventory').send(invalidData).expect(400);
    });

    it('should return 400 for requst with duplicate SKUs', async () => {
      const duplicateItems = [
        {
          sku: 'UK-1011',
          quantity: 5,
          description: 'First item',
          store: 'Store A',
        },
        {
          sku: 'UK-1011',
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
      // GIVEN
      const item = {
        quantity: 5,
        sku: 'UK-1011',
        description: 'Item',
        store: 'Store A',
      };

      await request(app).post('/api/inventory').send([item]).expect(201);

      // WHEN
      const updatedItem = {
        ...item,
        description: 'Updated Item',
      };

      const response = await request(app).post('/api/inventory').send([updatedItem]);

      // THEN
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
      // GIVEN
      const inventoryData = [
        { quantity: 10, sku: 'UK-1011', description: 'Item 1', store: 'Store A' },
        { quantity: 20, sku: 'UK-1012', description: 'Item 2', store: 'Store B' },
      ];

      await request(app).post('/api/inventory').send(inventoryData).expect(201);

      // WHEN
      const response = await request(app).get('/api/inventory').expect(200);

      // THEN
      expect(response.body).toHaveLength(2);
      expect(response.body).toMatchObject([
        {
          id: 2,
          ...inventoryData[1],
        },
        {
          id: 1,
          ...inventoryData[0],
        },
      ]);
    });
  });
});
