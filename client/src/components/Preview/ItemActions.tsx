import { Button } from '../ui';
import type { Item } from '../../types/item';

interface ItemActionsProps {
  items: Item[];
  onEdit: (index: number, item: Item) => void;
  onDelete: (index: number) => void;
}

const CLASSES = {
  itemActions: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  itemActionsButtonGroup: 'flex gap-2',
} as const;

export function ItemActions({ items, onEdit, onDelete }: ItemActionsProps) {
  return (
    <div className={CLASSES.itemActions}>
      {items.map((item, index) => (
        <div key={index} className={CLASSES.itemActionsButtonGroup}>
          <Button variant="warning" onClick={() => onEdit(index, item)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(index)}>
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
