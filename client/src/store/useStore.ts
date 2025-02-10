import { create } from 'zustand';
import type { Item } from '../types/item';
import type { InventoryItem } from '../types/inventoryItem';
import { Inventory } from '../types/inventory';

interface PreviewStore {
  items: Item[];
  addItems: (items: Item[]) => void;
  removeItem: (index: number) => void;
  addItem: (row: Item) => void;
  editItem: (index: number, row: Item) => void;
  clearItems: () => void;
}

interface InventoryStore {
  inventory: InventoryItem[];
  refreshError: string | null;
  submitError: string | null;
  refreshInventory: () => Promise<void>;
  submitItems: (items: Item[]) => Promise<void>;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  items: [],
  addItems: (items: Item[]) =>
    set((state) => ({
      items: [...state.items, ...items],
    })),
  addItem: (row: Item) =>
    set((state) => ({
      items: [...state.items, row],
    })),
  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),
  editItem: (index, updatedItem) =>
    set((state) => {
      return {
        items: state.items.map((row, rowIndex) => (rowIndex === index ? updatedItem : row)),
      };
    }),
  clearItems: () => set({ items: [] }),
}));

export const useInventoryStore = create<InventoryStore>((set) => ({
  inventory: [],
  refreshError: null,
  submitError: null,
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
}));

async function parseResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Server error: ${response.statusText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Invalid JSON response from server');
  }
  return data;
}
