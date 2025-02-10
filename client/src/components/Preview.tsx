import { usePreviewStore, useInventoryStore } from '../store/useStore';
import { Table } from './Table';
import { Button } from './Button';
import type { Item } from '../types/item';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  content: 'flex gap-4 w-full border-2 border-dashed rounded-lg p-8 border-gray-300',
  itemActions: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  itemActionsButtonGroup: 'flex gap-2',
  actionsButtonGroup: 'mt-4 flex gap-2',
} as const;

export function Preview({
  onEditItem,
  onAddItem,
  onSubmitItems,
}: {
  onEditItem: (index: number, item: Item) => void;
  onAddItem: () => void;
  onSubmitItems?: () => void;
}) {
  const items = usePreviewStore((state) => state.items);
  const submitItems = useInventoryStore((state) => state.submitItems);
  const refreshInventory = useInventoryStore((state) => state.refreshInventory);
  const removeItem = usePreviewStore((state) => state.removeItem);
  const clearItems = usePreviewStore((state) => state.clearItems);

  if (items.length === 0) return null;

  const columns = [
    { name: 'quantity', header: 'Quantity' },
    { name: 'sku', header: 'SKU' },
    { name: 'description', header: 'Description' },
    { name: 'store', header: 'Store' },
  ];

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Preview</h2>
      <div className={CLASSES.content}>
        <div className="flex-1 flex flex-col">
          <Table data={items} columns={columns} rowKey="sku" />
          <div className={CLASSES.actionsButtonGroup}>
            <Button variant="primary" onClick={() => onAddItem()}>
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
        </div>
        <div className={CLASSES.itemActions}>
          {items.map((_, index) => (
            <div key={index} className={CLASSES.itemActionsButtonGroup}>
              <Button variant="warning" onClick={() => onEditItem(index, items[index])}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => removeItem(index)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
