import { useState } from 'react';
import { DragAndDrop } from './components/DragAndDrop';
import { Preview } from './components/Preview';
import { AddItem } from './components/AddItem';
import { useStore } from './store/useStore';
import { CsvSchema } from './types/csv';
import { EditItem } from './components/EditItem';
import type { Item } from './types/item';

const CLASSES = {
  container: 'min-h-screen bg-gray-50',
  innerContainer: 'max-w-7xl mx-auto px-4 py-8',
  title: 'text-3xl font-bold mb-8',
};

function App() {
  const addItems = useStore(state => state.addItems);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToEditIndex, setItemToEditIndex] = useState<number>(-1);
  const [showAddItem, setShowAddItem] = useState<boolean>(false);
  const handleCSVFile = async (file: File) => {
    try {
      const text = await file.text();
      const rows = text
        .split('\n')
        .slice(1) // Remove header
        .map(line => {
          const [quantity, sku, description, store] = line.split(',');
          return { quantity, sku, description, store };
        });

        addItems(CsvSchema.parse(rows));
    } catch (error) {
      throw new Error('Error parsing CSV.', { cause: error });
    }
  };

  const shouldShowEditItem = itemToEdit && itemToEditIndex !== -1;

  const editItem = (index: number, item: Item) => {
    setItemToEdit(item);
    setItemToEditIndex(index);
  }

  const hideEditItem = () => {
    setItemToEdit(null);
    setItemToEditIndex(-1);
  }

  const hideAddItem = () => {
    setShowAddItem(false);
  }

  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.innerContainer}>
        <h1 className={CLASSES.title}>Zapp Test</h1>
        <DragAndDrop onFileDrop={handleCSVFile} label="Drop CSV file here" />
        <Preview onEditItem={editItem} onAddItem={() => setShowAddItem(true)} />
        {shouldShowEditItem && <EditItem index={itemToEditIndex} item={itemToEdit} onSave={hideEditItem} />}
        {showAddItem && <AddItem onSave={hideAddItem} />}
      </div>
    </div>
  );
}

export default App; 