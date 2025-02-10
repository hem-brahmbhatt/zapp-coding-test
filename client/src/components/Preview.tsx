import { useStore } from '../store/useStore';
import { Table } from './Table';
import { Button } from './Button';
import type { Item } from '../types/item';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  content: 'flex gap-4 w-full',
  actions: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  buttonGroup: 'flex gap-2',
  addButton: 'mt-4'
} as const;

export function Preview({ onEditItem, onAddItem }: { onEditItem: (index: number, item: Item) => void, onAddItem: () => void }) {
  const items = useStore(state => state.items);
  const removeItem = useStore(state => state.removeItem);

  if (items.length === 0) return null;

  const columns = [
    { name: 'quantity', header: 'Quantity' },
    { name: 'sku', header: 'SKU' },
    { name: 'description', header: 'Description' },
    { name: 'store', header: 'Store' }
  ];

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Preview</h2>
      <div className={CLASSES.content}>
        <div className="flex-1 flex flex-col">
          <Table 
            data={items}
            columns={columns}
            rowKey="sku"
          />
          <div className={CLASSES.addButton}>
            <Button
              variant="primary"
              onClick={() => onAddItem()}
            >
              Add Item
            </Button>
          </div>
        </div>
        <div className={CLASSES.actions}>
          {items.map((_, index) => (
            <div key={index} className={CLASSES.buttonGroup}>
              <Button
                variant="warning"
                onClick={() => onEditItem(index, items[index])}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => removeItem(index)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}