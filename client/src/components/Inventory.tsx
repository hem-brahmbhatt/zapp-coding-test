import { useEffect } from 'react';
import { useInventoryStore } from '../store/useStore';
import { Table } from './Table';
import { Button } from './Button';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  content: 'flex gap-4 w-full',
  itemActions: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  itemActionsButtonGroup: 'flex gap-2',
  actionsButtonGroup: 'mt-4 flex gap-2',
} as const;

export function Inventory() {
  const inventory = useInventoryStore((state) => state.inventory);
  const refreshInventory = useInventoryStore((state) => state.refreshInventory);

  useEffect(() => {
    const fetchData = async () => refreshInventory();
    fetchData();
  }, [refreshInventory]);

  if (inventory.length === 0) return null;

  const columns = [
    { name: 'id', header: 'ID' },
    { name: 'quantity', header: 'Quantity' },
    { name: 'sku', header: 'SKU' },
    { name: 'description', header: 'Description' },
    { name: 'store', header: 'Store' },
  ];

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Inventory</h2>
      <div className={CLASSES.content}>
        <div className="flex-1 flex flex-col">
          <Table data={inventory} columns={columns} rowKey="id" />
          <div className={CLASSES.actionsButtonGroup}>
            <Button
              variant="primary"
              onClick={async () => {
                await refreshInventory();
              }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
