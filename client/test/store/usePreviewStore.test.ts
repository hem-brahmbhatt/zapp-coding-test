import { describe, it, expect, beforeEach } from 'vitest';
import { usePreviewStore } from '../../src/store/usePreviewStore';
import { Item } from '../../src/types/item';

describe('usePreviewStore', () => {
  beforeEach(() => {
    usePreviewStore.getState().clearItems();
  });

  const mockItem: Item = {
    sku: 'UK-1011',
    description: 'Test Item',
    quantity: 10,
    store: 'YNAP',
  };

  const mockItem2: Item = {
    sku: 'UK-1012',
    description: 'Test Item 2',
    quantity: 5,
    store: 'YNAP',
  };

  describe('addItem', () => {
    it('should add a single item to the store', () => {
      usePreviewStore.getState().addItem(mockItem);
      expect(usePreviewStore.getState().items).toHaveLength(1);
      expect(usePreviewStore.getState().items[0]).toEqual(mockItem);
    });

    it('should throw error when adding item with duplicate SKU', () => {
      usePreviewStore.getState().addItem(mockItem);
      expect(() => usePreviewStore.getState().addItem(mockItem)).toThrow(
        'Item with SKU UK-1011 already exists'
      );
    });
  });

  describe('addItems', () => {
    it('should add multiple items to the store', () => {
      usePreviewStore.getState().addItems([mockItem, mockItem2]);
      expect(usePreviewStore.getState().items).toHaveLength(2);
      expect(usePreviewStore.getState().items).toEqual([mockItem, mockItem2]);
    });

    it('should throw error when adding items with duplicate SKU', () => {
      usePreviewStore.getState().addItem(mockItem);
      expect(() => usePreviewStore.getState().addItems([mockItem2, mockItem])).toThrow(
        'Item with SKU UK-1011 already exists'
      );
    });
  });

  describe('removeItem', () => {
    it('should remove an item at specified index', () => {
      usePreviewStore.getState().addItems([mockItem, mockItem2]);
      usePreviewStore.getState().removeItem(0);
      expect(usePreviewStore.getState().items).toHaveLength(1);
      expect(usePreviewStore.getState().items[0]).toEqual(mockItem2);
    });
  });

  describe('editItem', () => {
    it('should edit an item at specified index', () => {
      usePreviewStore.getState().addItem(mockItem);
      const updatedItem = { ...mockItem, name: 'Updated Name' };
      usePreviewStore.getState().editItem(0, updatedItem);
      expect(usePreviewStore.getState().items[0]).toEqual(updatedItem);
    });

    it('should throw error when editing item to have duplicate SKU', () => {
      usePreviewStore.getState().addItems([mockItem, mockItem2]);
      const updatedItem = { ...mockItem2, sku: mockItem.sku };
      expect(() => usePreviewStore.getState().editItem(1, updatedItem)).toThrow(
        'Cannot update: Item with SKU UK-1011 already exists'
      );
    });
  });

  describe('clearItems', () => {
    it('should remove all items from the store', () => {
      usePreviewStore.getState().addItems([mockItem, mockItem2]);
      usePreviewStore.getState().clearItems();
      expect(usePreviewStore.getState().items).toHaveLength(0);
    });
  });
}); 