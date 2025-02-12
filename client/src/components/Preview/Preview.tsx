import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInventoryStore } from '../../store/useInventoryStore';
import { usePreviewStore } from '../../store/usePreviewStore';
import type { Item } from '../../types/item';
import { EditItem, AddItem } from '..';
import { PreviewTable } from './PreviewTable';
import { ItemActions } from './ItemActions';

const CLASSES = {
  container: 'mt-8',
  title: 'text-xl font-bold mb-4',
  content: 'flex flex-col gap-4 w-full border-2 border-dashed rounded-lg p-8 border-gray-300',
  tableSection: 'flex gap-4',
} as const;

export function Preview({ onSubmitItems }: { onSubmitItems?: () => void }) {
  const [submitItems, refreshInventory] = useInventoryStore(
    useShallow((state) => [state.submitItems, state.refreshInventory])
  );

  const [items, removeItem, clearItems, editItem, addItem] = usePreviewStore(
    useShallow((state) => [
      state.items,
      state.removeItem,
      state.clearItems,
      state.editItem,
      state.addItem,
    ])
  );

  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToEditIndex, setItemToEditIndex] = useState<number>(-1);
  const [shouldShowAddItem, setShouldShowAddItem] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) return null;

  const shouldShowEditItem = itemToEdit && itemToEditIndex !== -1;
  const shouldShowActions = !shouldShowAddItem && !shouldShowEditItem;

  const updateItem = (item: Partial<Item>) => {
    setItemToEdit((prevItem) => (prevItem ? { ...prevItem, ...item } : null));
  };

  const showEditItem = (index: number, item: Item) => {
    setItemToEdit(item);
    setItemToEditIndex(index);
  };

  const handleEditItem = (validatedItem: Item) => {
    editItem(itemToEditIndex, validatedItem);
    hideEditItem();
    return Promise.resolve();
  };

  const hideEditItem = () => {
    setItemToEdit(null);
    setItemToEditIndex(-1);
  };

  const hideAddItem = () => {
    setShouldShowAddItem(false);
  };

  const handleAddItem = (item: Item) => {
    addItem(item);
    hideAddItem();
    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      await submitItems(items);
      await refreshInventory();
      clearItems();
      onSubmitItems?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit items');
    }
  };

  return (
    <div className={CLASSES.container}>
      <h2 className={CLASSES.title}>Preview</h2>
      <div className={CLASSES.content}>
        <div className={CLASSES.tableSection}>
          <PreviewTable
            items={items}
            error={error}
            shouldShowActions={shouldShowActions}
            onAddItem={() => setShouldShowAddItem(true)}
            onSubmit={handleSubmit}
          />
          <ItemActions items={items} onEdit={showEditItem} onDelete={removeItem} />
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
