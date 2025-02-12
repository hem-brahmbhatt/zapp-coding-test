import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { usePreviewStore } from '../store/usePreviewStore';
import type { Item } from '../types/item';
import { Table, Button } from './ui';
import { EditItem, AddItem } from './';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  content: 'flex flex-col gap-4 w-full border-2 border-dashed rounded-lg p-8 border-gray-300',
  tableSection: 'flex gap-4',
  tableActions: 'mt-4 flex gap-2',
  table: 'flex-1 flex flex-col',
  itemActions: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  itemActionsButtonGroup: 'flex gap-2',
  error: 'text-red-500',
} as const;

export function Preview({ onSubmitItems }: { onSubmitItems?: () => void }) {
  const items = usePreviewStore((state) => state.items);
  const submitItems = useInventoryStore((state) => state.submitItems);
  const refreshInventory = useInventoryStore((state) => state.refreshInventory);
  const removeItem = usePreviewStore((state) => state.removeItem);
  const clearItems = usePreviewStore((state) => state.clearItems);
  const editItem = usePreviewStore((state) => state.editItem);
  const addItem = usePreviewStore((state) => state.addItem);

  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToEditIndex, setItemToEditIndex] = useState<number>(-1);
  const [shouldShowAddItem, setShouldShowAddItem] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) return null;

  const columns = [
    { name: 'quantity', header: 'Quantity' },
    { name: 'sku', header: 'SKU' },
    { name: 'description', header: 'Description' },
    { name: 'store', header: 'Store' },
  ];

  const shouldShowEditItem = itemToEdit && itemToEditIndex !== -1;

  const shouldShowActions = !shouldShowAddItem && !shouldShowEditItem;

  const updateItem = (item: Partial<Item>) => {
    setItemToEdit((prevItem) => {
      if (!prevItem) return null;
      return { ...prevItem, ...item };
    });
  };

  const showEditItem = (index: number, item: Item) => {
    setItemToEdit(item);
    setItemToEditIndex(index);
  };

  const handleEditItem = (validatedItem: Item) => {
    editItem(itemToEditIndex, validatedItem);
    hideEditItem();
    return Promise.resolve();
  };

  const hideEditItem = () => {
    setItemToEdit(null);
    setItemToEditIndex(-1);
  };

  const hideAddItem = () => {
    setShouldShowAddItem(false);
  };

  const handleAddItem = (item: Item) => {
    addItem(item);
    hideAddItem();
    return Promise.resolve();
  };

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Preview</h2>
      <div className={CLASSES.content}>
        <div className={CLASSES.tableSection}>
          <div className={CLASSES.table}>
            <Table data={items} columns={columns} rowKey="sku" />
            {shouldShowActions && (
              <div className={CLASSES.tableActions}>
                <Button variant="primary" onClick={() => setShouldShowAddItem(true)}>
                  Add Item
                </Button>
                <Button
                  variant="primary"
                  onClick={async () => {
                    try {
                      await submitItems(items);
                      await refreshInventory();
                      clearItems();
                      onSubmitItems?.();
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to submit items');
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            )}
            {error && <div className={CLASSES.error}>{error}</div>}
          </div>
          <div className={CLASSES.itemActions}>
            {items.map((_, index) => (
              <div key={index} className={CLASSES.itemActionsButtonGroup}>
                <Button variant="warning" onClick={() => showEditItem(index, items[index])}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => removeItem(index)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
        {shouldShowEditItem && (
          <EditItem
            item={itemToEdit}
            updateItem={updateItem}
            onSave={handleEditItem}
            onCancel={hideEditItem}
          />
        )}
        {shouldShowAddItem && <AddItem onSave={handleAddItem} onCancel={hideAddItem} />}
      </div>
    </div>
  );
}
