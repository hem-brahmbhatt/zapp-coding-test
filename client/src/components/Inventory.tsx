import { useEffect, useState } from 'react';
import { useInventoryStore } from '../store/useStore';
import { Table, Button } from './ui';
import { Item } from '../types/item';
import { EditItem } from './EditItem';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  tableSection: 'flex gap-4',
  table: 'flex-1 flex flex-col',
  content: 'flex gap-4 w-full flex-1 flex-col',
  itemActions: 'flex flex-col justify-start gap-4 pt-[3.7rem]',
  itemActionsButtonGroup: 'flex gap-2',
  actionsButtonGroup: 'mt-4 flex gap-2',
} as const;

const columns = [
  { name: 'quantity', header: 'Quantity' },
  { name: 'sku', header: 'SKU' },
  { name: 'description', header: 'Description' },
  { name: 'store', header: 'Store' },
];

export function Inventory() {
  const inventory = useInventoryStore((state) => state.inventory);
  const refreshInventory = useInventoryStore((state) => state.refreshInventory);
  const removeItem = useInventoryStore((state) => state.removeItem);
  const editItem = useInventoryStore((state) => state.editItem);

  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToEditIndex, setItemToEditIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchData = async () => refreshInventory();
    fetchData();
  }, [refreshInventory]);

  if (inventory.length === 0) return null;

  const shouldShowEditItem = itemToEdit && itemToEditIndex !== -1;

  const updateItem = (item: Partial<Item>) => {
    setItemToEdit((prevItem) => {
      if (!prevItem) return null;
      return { ...prevItem, ...item };
    });
  };

  const handleEditItem = (validatedItem: Item) => {
    if (!itemToEdit) return;
    editItem(itemToEdit, validatedItem);
    hideEditItem();
  };

  const showEditItem = (index: number, item: Item) => {
    setItemToEdit(item);
    setItemToEditIndex(index);
  };

  const hideEditItem = () => {
    setItemToEdit(null);
    setItemToEditIndex(-1);
  };

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Inventory</h2>
      <div className={CLASSES.content}>
        <div className={CLASSES.tableSection}>
          <div className={CLASSES.table}>
            <Table data={inventory} columns={columns} rowKey="sku" />
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
          <div className={CLASSES.itemActions}>
            {inventory.map((item, index) => (
              <div key={index} className={CLASSES.itemActionsButtonGroup}>
                <Button variant="warning" onClick={() => showEditItem(index, item)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => removeItem(item)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
        {shouldShowEditItem && (
          <EditItem
            item={itemToEdit}
            updateItem={updateItem}
            onSave={handleEditItem}
            onCancel={hideEditItem}
          />
        )}
      </div>
    </div>
  );
}
