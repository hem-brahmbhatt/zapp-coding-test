import { useInventoryStore } from '../../src/store/useStore';
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
        { id: 1, quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' },
        { id: 2, quantity: 10, sku: '456', description: 'Item 2', store: 'Store 2' },
      ];

      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockInventory), {
        status: 200,
        statusText: 'OK',
      }));

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
      mockFetch.mockResolvedValueOnce(new Response('invalid json', {
        status: 200,
        statusText: 'OK',
      }));

      const store = useInventoryStore.getState();
      await store.refreshInventory();

      expect(useInventoryStore.getState().refreshError).toBe('Invalid JSON response from server');
      expect(useInventoryStore.getState().inventory).toEqual([]);
    });

    it('should handle non-OK response', async () => {
      mockFetch.mockResolvedValueOnce(new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
      }));

      const store = useInventoryStore.getState();
      await store.refreshInventory();

      expect(useInventoryStore.getState().refreshError).toBe('Server error: Not Found');
      expect(useInventoryStore.getState().inventory).toEqual([]);
    });
  });

  describe('submitItems', () => {
    it('should successfully submit items', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), {
        status: 200,
        statusText: 'OK',
      }));

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
      mockFetch.mockResolvedValueOnce(new Response('Bad Request', {
        status: 400,
        statusText: 'Bad Request',
      }));

      const items: Item[] = [{ quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' }];
      const store = useInventoryStore.getState();

      await expect(store.submitItems(items)).rejects.toThrow();
      expect(useInventoryStore.getState().submitError).toBe('Server error: Bad Request');
    });

    it('should handle invalid JSON response during submit', async () => {
      mockFetch.mockResolvedValueOnce(new Response('invalid json', {
        status: 200,
        statusText: 'OK',
      }));

      const items: Item[] = [{ quantity: 5, sku: '123', description: 'Item 1', store: 'Store 1' }];
      const store = useInventoryStore.getState();

      await expect(store.submitItems(items)).rejects.toThrow();
      expect(useInventoryStore.getState().submitError).toBe('Invalid JSON response from server');
    });
  });
}); 