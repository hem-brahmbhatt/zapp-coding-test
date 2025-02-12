import { Button } from '../ui';
import { Item } from '../../types/item';

const CLASSES = {
  container: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  buttonGroup: 'flex gap-2',
} as const;

interface InventoryItemActionsProps {
  inventory: Item[];
  itemToConfirm: number | null;
  onEdit: (index: number, item: Item) => void;
  onDelete: (index: number) => void;
  onConfirmDelete: (item: Item) => void;
}

export function InventoryItemActions({
  inventory,
  itemToConfirm,
  onEdit,
  onDelete,
  onConfirmDelete,
}: InventoryItemActionsProps) {
  return (
    <div className={CLASSES.container}>
      {inventory.map((item, index) => (
        <div key={index} className={CLASSES.buttonGroup}>
          <Button variant="warning" onClick={() => onEdit(index, item)}>
            Edit
          </Button>
          {itemToConfirm === index ? (
            <Button variant="danger" onClick={() => onConfirmDelete(item)}>
              Confirm
            </Button>
          ) : (
            <Button variant="warning" onClick={() => onDelete(index)}>
              Delete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
