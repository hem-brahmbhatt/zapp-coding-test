import { DragAndDrop } from './components/ui';
import { Preview, Inventory } from './components';
import { usePreviewStore } from './store/useStore';
import { CsvSchema } from './types/csv';

const CLASSES = {
  container: 'min-h-screen bg-gray-50',
  innerContainer: 'max-w-7xl mx-auto px-4 py-8',
  title: 'text-3xl font-bold mb-8',
};

function App() {
  const addItems = usePreviewStore((state) => state.addItems);
  const items = usePreviewStore((state) => state.items);

  const handleCSVFile = async (file: File) => {
    try {
      const text = await file.text();
      const rows = text
        .split('\n')
        .slice(1) // Remove header
        .map((line) => {
          const [quantity, sku, description, store] = line.split(',');
          return { quantity, sku, description, store };
        });

      addItems(CsvSchema.parse(rows));
    } catch (error) {
      throw new Error('Error parsing CSV.', { cause: error });
    }
  };


  return (
    <div className={CLASSES.container}>
      <div className={CLASSES.innerContainer}>
        <h1 className={CLASSES.title}>Zapp Test</h1>
        {items.length === 0 && (
          <DragAndDrop onFileDrop={handleCSVFile} label="Drop CSV file here" />
        )}
        <Preview />
        <Inventory />
      </div>
    </div>
  );
}

export default App;
