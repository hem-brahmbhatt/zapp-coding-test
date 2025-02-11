import { Router } from 'express';
import {
  createOrUpdateInventory,
  getInventory,
  deleteInventory,
  updateInventory,
} from '../controller/inventory';

export const createInventoryRouter = () => {
  const router = Router();

  router.post('/inventory', createOrUpdateInventory);
  router.get('/inventory', getInventory);
  router.delete('/inventory/:sku', deleteInventory);
  router.put('/inventory/:sku', updateInventory);

  return router;
};
