import { useState } from 'react';
import { ZodError } from 'zod';
import { Button, Input } from './ui';
import { Item } from '../types/item';

const CLASSES = {
  container: 'mt-8',
  content: 'flex gap-6 w-full',
  buttonWrapper: 'flex gap-2 items-end',
  error: 'text-red-500 mt-2',
} as const;

export function AddItem({ onSave, onCancel }: { onSave: (item: Item) => void; onCancel: () => void }) {
  const [item, setItem] = useState({
    quantity: 0,
    sku: '',
    description: '',
    store: '',
  });
  const [error, setError] = useState<string | null>(null);

  const resetInputs = () => {
    setItem({
      quantity: 0,
      sku: '',
      description: '',
      store: '',
    });
  };

  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.content}>
        <Input
          label="Quantity"
          type="number"
          value={item.quantity}
          onChange={(e) =>
            setItem((prevItem) => ({ ...prevItem, quantity: parseInt(e.target.value) }))
          }
        />
        <Input
          label="SKU"
          type="text"
          value={item.sku}
          onChange={(e) => setItem((prevItem) => ({ ...prevItem, sku: e.target.value }))}
        />
        <Input
          label="Description"
          type="text"
          value={item.description}
          onChange={(e) => setItem((prevItem) => ({ ...prevItem, description: e.target.value }))}
        />
        <Input
          label="Store"
          type="text"
          value={item.store}
          onChange={(e) => setItem((prevItem) => ({ ...prevItem, store: e.target.value }))}
        />
        <div className={CLASSES.buttonWrapper}>
          <Button
            onClick={() => {
              try {
                const validatedItem = Item.parse(item);
                onSave(validatedItem);
                resetInputs();
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
            Add
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
