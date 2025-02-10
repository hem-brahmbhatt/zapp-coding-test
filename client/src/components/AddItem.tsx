import { useState } from 'react';
import { usePreviewStore } from '../store/useStore';
import { Button, Input } from './ui';

const CLASSES = {
  container: 'mt-8',
  content: 'flex gap-6 w-full',
  buttonWrapper: 'flex gap-2 items-end',
} as const;

export function AddItem({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [item, setItem] = useState({
    quantity: 0,
    sku: '',
    description: '',
    store: '',
  });

  const addItem = usePreviewStore((state) => state.addItem);

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
              addItem(item);
              resetInputs();
              onSave();
            }}
          >
            Add
          </Button>
          <Button variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
