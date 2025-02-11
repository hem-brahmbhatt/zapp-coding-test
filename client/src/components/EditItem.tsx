import { useState } from 'react';
import { usePreviewStore } from '../store/useStore';
import { Item } from '../types/item';
import { Button, Input } from './ui';
import { ZodError } from 'zod';

const CLASSES = {
  container: 'mt-8',
  content: 'flex gap-6 w-full',
  buttonWrapper: 'flex gap-2 items-end',
  error: 'text-red-500 mt-2',
} as const;

export function EditItem({
  index,
  item,
  updateItem,
  onSave,
  onCancel,
}: {
  index: number;
  item: Item;
  updateItem: (item: Partial<Item>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const editItem = usePreviewStore((state) => state.editItem);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.content}>
        <Input
          label="Quantity"
          type="number"
          value={item.quantity}
          onChange={(e) => updateItem({ quantity: parseInt(e.target.value) })}
        />
        <Input
          label="SKU"
          type="text"
          value={item.sku}
          onChange={(e) => updateItem({ sku: e.target.value })}
        />
        <Input
          label="Description"
          type="text"
          value={item.description}
          onChange={(e) => updateItem({ description: e.target.value })}
        />
        <Input
          label="Store"
          type="text"
          value={item.store}
          onChange={(e) => updateItem({ store: e.target.value })}
        />
        <div className={CLASSES.buttonWrapper}>
          <Button
            onClick={() => {
              try {
                const validatedItem = Item.parse(item);
                editItem(index, validatedItem);
                onSave();
              } catch (error) {
                if (error instanceof ZodError) {
                  setError(error.issues[0].message);
                } else if (error instanceof Error) {
                  setError(error.message);
                } else {
                  setError('An unknown error occurred');
                }
              }
            }}
          >
            Save
          </Button>
          <Button variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
      {error && <p className={CLASSES.error}>{error}</p>}
    </div>
  );
}
