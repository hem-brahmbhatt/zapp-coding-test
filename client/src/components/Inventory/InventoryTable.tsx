import { Table, Button } from '../ui';
import { Item } from '../../types/item';

const CLASSES = {
  container: 'flex-1 flex flex-col',
  actions: 'mt-4 flex gap-2',
} as const;

interface InventoryTableProps {
  inventory: Item[];
  onRefresh: () => Promise<void>;
  onAddItem: () => void;
}

const columns = [
  { name: 'quantity', header: 'Quantity' },
  { name: 'sku', header: 'SKU' },
  { name: 'description', header: 'Description' },
  { name: 'store', header: 'Store' },
];

export function InventoryTable({ inventory, onRefresh, onAddItem }: InventoryTableProps) {
  return (
    <div className={CLASSES.container}>
      <Table data={inventory} columns={columns} rowKey="sku" />
      <div className={CLASSES.actions}>
        <Button variant="primary" onClick={onRefresh}>
          Refresh
        </Button>
        <Button variant="primary" onClick={onAddItem}>
          Add Item
        </Button>
      </div>
    </div>
  );
}
