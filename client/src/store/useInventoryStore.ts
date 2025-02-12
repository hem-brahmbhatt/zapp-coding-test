import { create } from 'zustand';
import { Item } from '../types/item';
import { Inventory } from '../types/inventory';

interface InventoryStore {
  inventory: Item[];
  refreshError: string | null;
  submitError: string | null;
  deleteError: string | null;
  editError: string | null;
  createError: string | null;
  refreshInventory: () => Promise<void>;
  submitItems: (items: Item[]) => Promise<void>;
  removeItem: (item: Item) => Promise<void>;
  editItem: (oldItem: Item, newItem: Item) => Promise<void>;
  createItem: (item: Item) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  inventory: [],
  refreshError: null,
  submitError: null,
  deleteError: null,
  editError: null,
  createError: null,
  refreshInventory: async () => {
    try {
      const response = await fetch('/api/inventory');

      const data = await parseResponse(response);

      try {
        const inventory = Inventory.parse(data);
        set({ inventory, refreshError: null });
      } catch (err) {
        throw new Error('Invalid inventory data format received from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh inventory';
      set({ refreshError: errorMessage });
    }
  },
  submitItems: async (items: Item[]) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        body: JSON.stringify(items),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await parseResponse(response);

      set({ submitError: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit items';
      set({ submitError: errorMessage });
      throw err;
    }
  },
  removeItem: async (item) => {
    try {
      const response = await fetch(`/api/inventory/${item.sku}`, {
        method: 'DELETE',
      });

      await parseResponse(response);

      set((state) => ({
        inventory: state.inventory.filter((i) => i.sku !== item.sku),
        deleteError: null,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to delete item with SKU ${item.sku}`;
      set({ deleteError: errorMessage });
      throw err;
    }
  },
  editItem: async (oldItem, newItem) => {
    try {
      const response = await fetch(`/api/inventory/${oldItem.sku}`, {
        method: 'PUT',
        body: JSON.stringify(newItem),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await parseResponse(response);

      try {
        const updatedItem = Item.parse(data);
        set((state) => ({
          inventory: state.inventory.map((row) => (row.sku === oldItem.sku ? updatedItem : row)),
          editError: null,
        }));
      } catch (err) {
        throw new Error('Invalid inventory data format received from server');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to edit item with SKU ${oldItem.sku}`;
      set({ editError: errorMessage });
      throw err;
    }
  },
  createItem: async (item) => {
    try {
      const response = await fetch(`/api/inventory/${item.sku}`, {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await parseResponse(response);
      set((state) => ({
        inventory: [...state.inventory, item],
        createError: null,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      set({ createError: errorMessage });
      throw err;
    }
  },
}));

async function parseResponse(response: Response) {
  let data;

  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}
