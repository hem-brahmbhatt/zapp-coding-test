import { create } from 'zustand';
import { Item } from '../types/item';

interface PreviewStore {
  items: Item[];
  addItems: (items: Item[]) => void;
  removeItem: (index: number) => void;
  addItem: (row: Item) => void;
  editItem: (index: number, row: Item) => void;
  clearItems: () => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  items: [],
  addItems: (items: Item[]) =>
    set((state) => {
      const duplicateSku = items.find((item) =>
        state.items.some((existing) => existing.sku === item.sku)
      );
      if (duplicateSku) {
        throw new Error(`Item with SKU ${duplicateSku.sku} already exists`);
      }
      return {
        items: [...state.items, ...items],
      };
    }),
  addItem: (item: Item) =>
    set((state) => {
      if (state.items.some((row) => item.sku === row.sku)) {
        throw new Error(`Item with SKU ${item.sku} already exists`);
      }
      return {
        items: [...state.items, item],
      };
    }),
  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),
  editItem: (index, updatedItem) =>
    set((state) => {
      const hasDuplicateSku = state.items.some(
        (item, i) => i !== index && item.sku === updatedItem.sku
      );
      if (hasDuplicateSku) {
        throw new Error(`Cannot update: Item with SKU ${updatedItem.sku} already exists`);
      }
      return {
        items: state.items.map((row, rowIndex) => (rowIndex === index ? updatedItem : row)),
      };
    }),
  clearItems: () => set({ items: [] }),
}));
