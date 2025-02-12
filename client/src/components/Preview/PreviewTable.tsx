import { Table, Button } from '../ui';
import type { Item } from '../../types/item';

interface PreviewTableProps {
  items: Item[];
  error: string | null;
  shouldShowActions: boolean;
  onAddItem: () => void;
  onSubmit: () => Promise<void>;
}

const CLASSES = {
  table: 'flex-1 flex flex-col',
  tableActions: 'mt-4 flex gap-2',
  error: 'text-red-500',
} as const;

const columns = [
  { name: 'quantity', header: 'Quantity' },
  { name: 'sku', header: 'SKU' },
  { name: 'description', header: 'Description' },
  { name: 'store', header: 'Store' },
];

export function PreviewTable({
  items,
  error,
  shouldShowActions,
  onAddItem,
  onSubmit,
}: PreviewTableProps) {
  return (
    <div className={CLASSES.table}>
      <Table data={items} columns={columns} rowKey="sku" />
      {shouldShowActions && (
        <div className={CLASSES.tableActions}>
          <Button variant="primary" onClick={onAddItem}>
            Add Item
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      )}
      {error && <div className={CLASSES.error}>{error}</div>}
    </div>
  );
}
