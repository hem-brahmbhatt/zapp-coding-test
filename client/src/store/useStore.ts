import { create } from 'zustand';
import type { Item } from '../types/item';

interface Store {
  items: Item[];
  addItems: (items: Item[]) => void;
  removeItem: (index: number) => void;
  addItem: (row: Item) => void;
  editItem: (index: number, row: Item) => void;
}

export const useStore = create<Store>((set) => ({
  items: [],
  addItems: (items: Item[]) => set((state) => ({
    items: [...state.items, ...items]
  })),
  addItem: (row: Item) => set((state) => ({
    items: [...state.items, row]
  })),
  removeItem: (index) => set((state) => ({
    items: state.items.filter((_, i) => i !== index)
  })),
  editItem: (index, updatedItem) => set((state) => {
    return ({
      items: state.items.map((row, rowIndex) => rowIndex === index ? updatedItem : row)
    })
  })
})); 