import { Router } from 'express';
import {
  createOrUpdateInventory,
  getInventory,
  deleteInventory,
  updateInventory,
} from '../controller/inventory';
import { checkDatabaseExists } from '../controller/db';
import { validate } from '../controller/validator';
import { InventorySchema } from '../validator/inventory';
import { Item } from '../validator/item';

export const createInventoryRouter = () => {
  const router = Router();

  router.use(checkDatabaseExists);
  router.post('/inventory', validate(InventorySchema), createOrUpdateInventory);
  router.put('/inventory/:sku', validate(Item), updateInventory);
  router.get('/inventory', getInventory);
  router.delete('/inventory/:sku', deleteInventory);

  return router;
};
