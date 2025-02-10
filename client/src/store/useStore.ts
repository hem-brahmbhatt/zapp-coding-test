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
  refreshInventory: async () => {
    const response = await fetch('/api/inventory');
    const data = await response.json();
    const inventory = Inventory.parse(data);
    set({ inventory });
  },
  submitItems: async (items: Item[]) => {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(items),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await response.json();
  },
}));
