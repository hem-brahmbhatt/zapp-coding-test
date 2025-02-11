import { Router } from 'express';
import { updateInventory, getInventory } from '../controller/inventory';

export const createInventoryRouter = () => {
  const router = Router();

  router.post('/inventory', updateInventory);

  router.get('/inventory', getInventory);

  return router;
};
