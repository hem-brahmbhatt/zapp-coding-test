import { useInventoryStore } from '../../src/store/useInventoryStore';
import { describe, it, expect, beforeEach } from 'vitest';
import { Item } from '../../src/types/item';
import { vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;
const { Response } = global;

describe('useInventoryStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useInventoryStore.setState({
      inventory: [],
      refreshError: null,
      submitError: null,
    });
  });

  describe('refreshInventory', () => {
    it('should successfully fetch and update inventory', async () => {
      const mockInventory = [
        { quantity: 5, sku: 'UK-1234', description: 'Item 1', store: 'Store 1' },
        { quantity: 10, sku: 'UK-4567', description: 'Item 2', store: 'Store 2' },
      ];

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockInventory), {
          status: 200,
          statusText: 'OK',
        })
      );

      const store = useInventoryStore.getState();
      await store.refreshInventory();

      expect(mockFetch).toHaveBeenCalledWith('/api/inventory');
      expect(useInventoryStore.getState().refreshError).toBeNull();
      expect(useInventoryStore.getState().inventory).toEqual(mockInventory);
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const store = useInventoryStore.getState();
      await store.refreshInventory();

      expect(mockFetch).toHaveBeenCalledWith('/api/inventory');
      expect(useInventoryStore.getState().refreshError).toBe('Network error');
      expect(useInventoryStore.getState().inventory).toEqual([]);
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('invalid json', {
          status: 200,
          statusText: 'OK',
        })
      );

      const store = useInventoryStore.getState();
      await store.refreshInventory();

      expect(useInventoryStore.getState().refreshError).toBe('Invalid JSON response from server');
      expect(useInventoryStore.getState().inventory).toEqual([]);
    });

    it('should handle non-OK response', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          statusText: 'Not Found',
        })
      );

      const store = useInventoryStore.getState();
      await store.refreshInventory();

      expect(useInventoryStore.getState().refreshError).toBe('Not Found');
      expect(useInventoryStore.getState().inventory).toEqual([]);
    });
  });

  describe('submitItems', () => {
    it('should successfully submit items', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          statusText: 'OK',
        })
      );

      const items: Item[] = [
        { quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' },
        { quantity: 10, sku: '456', description: 'Item 2', store: 'Store 2' },
      ];

      const store = useInventoryStore.getState();
      await store.submitItems(items);

      expect(useInventoryStore.getState().submitError).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('/api/inventory', {
        method: 'POST',
        body: JSON.stringify(items),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should handle network error during submit', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const items: Item[] = [{ quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' }];
      const store = useInventoryStore.getState();

      await expect(store.submitItems(items)).rejects.toThrow();
      expect(useInventoryStore.getState().submitError).toBe('Network error');
    });

    it('should handle non-OK response during submit', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Duplicate SKU found' }), {
          status: 400,
          statusText: 'Bad Request',
        })
      );

      const items: Item[] = [{ quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' }];
      const store = useInventoryStore.getState();

      await expect(store.submitItems(items)).rejects.toThrow();
      expect(useInventoryStore.getState().submitError).toBe('Duplicate SKU found');
    });

    it('should handle invalid JSON response during submit', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('invalid json', {
          status: 200,
          statusText: 'OK',
        })
      );

      const items: Item[] = [{ quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' }];
      const store = useInventoryStore.getState();

      await expect(store.submitItems(items)).rejects.toThrow();
      expect(useInventoryStore.getState().submitError).toBe('Invalid JSON response from server');
    });
  });

  describe('removeItem', () => {
    it('should successfully remove an item', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          statusText: 'OK',
        })
      );

      const item: Item = { quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' };
      const store = useInventoryStore.getState();
      await store.removeItem(item);

      expect(mockFetch).toHaveBeenCalledWith(`/api/inventory/${item.sku}`, {
        method: 'DELETE',
      });
      expect(useInventoryStore.getState().deleteError).toBeNull();
    });

    it('should handle network error during remove', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const item: Item = { quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' };
      const store = useInventoryStore.getState();

      await expect(store.removeItem(item)).rejects.toThrow();
      expect(useInventoryStore.getState().deleteError).toBe('Network error');
    });

    it('should handle non-OK response during remove', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Item not found' }), {
          status: 404,
          statusText: 'Not Found',
        })
      );

      const item: Item = { quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' };
      const store = useInventoryStore.getState();

      await expect(store.removeItem(item)).rejects.toThrow();
      expect(useInventoryStore.getState().deleteError).toBe('Item not found');
    });

    it('should handle invalid JSON response during remove', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('invalid json', {
          status: 200,
          statusText: 'OK',
        })
      );

      const item: Item = { quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' };
      const store = useInventoryStore.getState();

      await expect(store.removeItem(item)).rejects.toThrow();
      expect(useInventoryStore.getState().deleteError).toBe('Invalid JSON response from server');
    });
  });

  describe('editItem', () => {
    it('should successfully edit an item', async () => {
      const originalItem = {
        id: 1,
        quantity: 5,
        sku: 'UK-1234',
        description: 'Item 1',
        store: 'Store 1',
      };
      const updatedItem = {
        id: 1,
        quantity: 10,
        sku: 'UK-1234',
        description: 'Updated Item 1',
        store: 'Store 1',
      };

      useInventoryStore.setState({
        inventory: [originalItem],
        editError: null,
        refreshError: null,
        submitError: null,
        deleteError: null,
      });

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(updatedItem), {
          status: 200,
          statusText: 'OK',
        })
      );

      const store = useInventoryStore.getState();
      await store.editItem(originalItem, updatedItem);

      expect(mockFetch).toHaveBeenCalledWith(`/api/inventory/${originalItem.sku}`, {
        method: 'PUT',
        body: JSON.stringify(updatedItem),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(useInventoryStore.getState().editError).toBeNull();
      expect(useInventoryStore.getState().inventory[0]).toEqual(updatedItem);
    });

    it('should handle network error during edit', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const originalItem: Item = {
        quantity: 5,
        sku: '123',
        description: 'Item 1',
        store: 'Store 1',
      };
      const updatedItem: Item = {
        quantity: 10,
        sku: '123',
        description: 'Updated Item 1',
        store: 'Store 1',
      };
      const store = useInventoryStore.getState();

      await expect(store.editItem(originalItem, updatedItem)).rejects.toThrow();
      expect(useInventoryStore.getState().editError).toBe('Network error');
    });

    it('should handle non-OK response during edit', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Item not found' }), {
          status: 404,
          statusText: 'Not Found',
        })
      );

      const originalItem: Item = {
        quantity: 5,
        sku: '123',
        description: 'Item 1',
        store: 'Store 1',
      };
      const updatedItem: Item = {
        quantity: 10,
        sku: '123',
        description: 'Updated Item 1',
        store: 'Store 1',
      };
      const store = useInventoryStore.getState();

      await expect(store.editItem(originalItem, updatedItem)).rejects.toThrow();
      expect(useInventoryStore.getState().editError).toBe('Item not found');
    });

    it('should handle invalid JSON response during edit', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('invalid json', {
          status: 200,
          statusText: 'OK',
        })
      );

      const originalItem: Item = {
        quantity: 5,
        sku: '123',
        description: 'Item 1',
        store: 'Store 1',
      };
      const updatedItem: Item = {
        quantity: 10,
        sku: '123',
        description: 'Updated Item 1',
        store: 'Store 1',
      };
      const store = useInventoryStore.getState();

      await expect(store.editItem(originalItem, updatedItem)).rejects.toThrow();
      expect(useInventoryStore.getState().editError).toBe('Invalid JSON response from server');
    });
  });
});
