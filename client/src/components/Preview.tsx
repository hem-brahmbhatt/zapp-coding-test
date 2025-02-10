import { useState } from 'react';
import { usePreviewStore, useInventoryStore } from '../store/useStore';
import type { Item } from '../types/item';
import { Table, Button } from './ui';
import { EditItem, AddItem } from './';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  content: 'flex flex-col gap-4 w-full border-2 border-dashed rounded-lg p-8 border-gray-300',
  tableSection: 'flex gap-4',
  itemActions: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  itemActionsButtonGroup: 'flex gap-2',
  actionsButtonGroup: 'mt-4 flex gap-2',
} as const;

export function Preview({ onSubmitItems }: { onSubmitItems?: () => void }) {
  const items = usePreviewStore((state) => state.items);
  const submitItems = useInventoryStore((state) => state.submitItems);
  const refreshInventory = useInventoryStore((state) => state.refreshInventory);
  const removeItem = usePreviewStore((state) => state.removeItem);
  const clearItems = usePreviewStore((state) => state.clearItems);

  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToEditIndex, setItemToEditIndex] = useState<number>(-1);
  const [showAddItem, setShowAddItem] = useState<boolean>(false);

  if (items.length === 0) return null;

  const columns = [
    { name: 'quantity', header: 'Quantity' },
    { name: 'sku', header: 'SKU' },
    { name: 'description', header: 'Description' },
    { name: 'store', header: 'Store' },
  ];

  const showEditItem = itemToEdit && itemToEditIndex !== -1;

  const showActions = !showAddItem && !showEditItem;

  const editItem = (index: number, item: Item) => {
    setItemToEdit(item);
    setItemToEditIndex(index);
  };

  const hideEditItem = () => {
    setItemToEdit(null);
    setItemToEditIndex(-1);
  };

  const hideAddItem = () => {
    setShowAddItem(false);
  };

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Preview</h2>
      <div className={CLASSES.content}>
        <div className={CLASSES.tableSection}>
          <div className="flex-1 flex flex-col">
            <Table data={items} columns={columns} rowKey="sku" />
            {showActions && (
              <div className={CLASSES.actionsButtonGroup}>
                <Button variant="primary" onClick={() => setShowAddItem(true)}>
                  Add Item
                </Button>
                <Button
                  variant="primary"
                  onClick={async () => {
                    await submitItems(items);
                    await refreshInventory();
                    clearItems();
                    onSubmitItems?.();
                  }}
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
          <div className={CLASSES.itemActions}>
            {items.map((_, index) => (
              <div key={index} className={CLASSES.itemActionsButtonGroup}>
                <Button variant="warning" onClick={() => editItem(index, items[index])}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => removeItem(index)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
        {showEditItem && (
          <EditItem
            index={itemToEditIndex}
            item={itemToEdit}
            onSave={hideEditItem}
            onCancel={hideEditItem}
          />
        )}
        {showAddItem && <AddItem onSave={hideAddItem} onCancel={hideAddItem} />}
      </div>
    </div>
  );
}
