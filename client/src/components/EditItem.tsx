import { useState } from 'react';
import { usePreviewStore } from '../store/useStore';
import { Button } from './Button';
import { Input } from './Input';
import type { Item } from '../types/item';
const CLASSES = {
  container: 'mt-8',
  content: 'flex gap-6 w-full',
  buttonWrapper: 'flex flex-col justify-end mb-[2px]',
} as const;

export function EditItem({
  index,
  item,
  onSave,
}: {
  index: number;
  item: Item;
  onSave: () => void;
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [sku, setSku] = useState(item.sku);
  const [description, setDescription] = useState(item.description);
  const [store, setStore] = useState(item.store);

  const editItem = usePreviewStore((state) => state.editItem);

  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.content}>
        <Input
          label="Quantity"
          type="text"
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
            variant="warning"
            onClick={() => {
              editItem(index, {
                quantity,
                sku,
                description,
                store,
              });
              onSave();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
