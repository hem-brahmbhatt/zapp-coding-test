import { usePreviewStore } from '../store/useStore';
import type { Item } from '../types/item';
import { Button, Input } from './ui';

const CLASSES = {
  container: 'mt-8',
  content: 'flex gap-6 w-full',
  buttonWrapper: 'flex gap-2 items-end',
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

  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.content}>
        <Input
          label="Quantity"
          type="text"
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
              editItem(index, item);
              onSave();
            }}
          >
            Save
          </Button>
          <Button variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
