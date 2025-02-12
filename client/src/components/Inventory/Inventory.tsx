import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInventoryStore } from '../../store/useInventoryStore';
import { Item } from '../../types/item';
import { EditItem } from '../EditItem';
import { AddItem } from '../AddItem';
import { InventoryTable } from './InventoryTable';
import { InventoryItemActions } from './InventoryItemActions';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  content: 'flex gap-4 w-full flex-1 flex-col',
  tableSection: 'flex gap-4',
} as const;

export function Inventory() {
  const [inventory, refreshInventory, removeItem, editItem, createItem] = useInventoryStore(
    useShallow((state) => [
      state.inventory,
      state.refreshInventory,
      state.removeItem,
      state.editItem,
      state.createItem,
    ])
  );

  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToEditIndex, setItemToEditIndex] = useState<number>(-1);
  const [shouldShowAddItem, setShouldShowAddItem] = useState<boolean>(false);
  const [itemToConfirm, setItemToConfirm] = useState<number | null>(null);

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

  const handleEditItem = async (validatedItem: Item) => {
    if (!itemToEdit) return;
    await editItem(itemToEdit, validatedItem);
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

  const handleAddItem = async (item: Item) => {
    await createItem(item);
    hideAddItem();
    await refreshInventory();
  };

  const hideAddItem = () => {
    setShouldShowAddItem(false);
  };

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Inventory</h2>
      <div className={CLASSES.content}>
        <div className={CLASSES.tableSection}>
          <InventoryTable
            inventory={inventory}
            onRefresh={refreshInventory}
            onAddItem={() => setShouldShowAddItem(true)}
          />
          <InventoryItemActions
            inventory={inventory}
            itemToConfirm={itemToConfirm}
            onEdit={showEditItem}
            onDelete={setItemToConfirm}
            onConfirmDelete={(item) => {
              setItemToConfirm(null);
              removeItem(item);
            }}
          />
        </div>
        {shouldShowEditItem && (
          <EditItem
            item={itemToEdit}
            updateItem={updateItem}
            onSave={handleEditItem}
            onCancel={hideEditItem}
          />
        )}
        {shouldShowAddItem && <AddItem onSave={handleAddItem} onCancel={hideAddItem} />}
      </div>
    </div>
  );
}
