import { Router } from 'express';
import {
  createOrUpdateInventory,
  getInventory,
  deleteInventoryItem,
  updateInventoryItem,
  createInventoryItem,
} from '../controller/inventory';
import { checkDatabaseExists } from '../middleware/db';
import { validate } from '../middleware/validator';
import { InventorySchema } from '../validator/inventory';
import { Item } from '../validator/item';

export const createInventoryRouter = () => {
  const router = Router();

  router.use(checkDatabaseExists);
  router.post('/inventory/:sku', validate(Item), createInventoryItem);
  router.post('/inventory', validate(InventorySchema), createOrUpdateInventory);
  router.put('/inventory/:sku', validate(Item), updateInventoryItem);
  router.get('/inventory', getInventory);
  router.delete('/inventory/:sku', deleteInventoryItem);

  return router;
};
