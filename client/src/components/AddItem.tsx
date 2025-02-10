import { useState } from 'react';
import { usePreviewStore } from '../store/useStore';
import { Button, Input } from './ui';

const CLASSES = {
  container: 'mt-8',
  content: 'flex gap-6 w-full',
  buttonWrapper: 'flex flex-col justify-end mb-[2px]',
} as const;

export function AddItem({ onSave }: { onSave: () => void }) {
  const [quantity, setQuantity] = useState(0);
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [store, setStore] = useState('');

  const addItem = usePreviewStore((state) => state.addItem);
  const resetInputs = () => {
    setQuantity(0);
    setSku('');
    setDescription('');
    setStore('');
  };

  const item = {
    quantity,
    sku,
    description,
    store,
  };

  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.content}>
        <Input
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <Input label="SKU" type="text" value={sku} onChange={(e) => setSku(e.target.value)} />
        <Input
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input label="Store" type="text" value={store} onChange={(e) => setStore(e.target.value)} />
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
        </div>
      </div>
    </div>
  );
}
