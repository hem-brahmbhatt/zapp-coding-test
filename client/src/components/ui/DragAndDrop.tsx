import { useState } from 'react';
import classNames from 'classnames';

const CLASSES = {
  base: ['border-2', 'border-dashed', 'rounded-lg', 'p-8', 'text-center', 'cursor-pointer', 'mt-4'],
  state: {
    dragging: ['border-blue-500', 'bg-blue-50'],
    default: ['border-gray-300', 'bg-white', 'hover:border-gray-400'],
  },
} as const;

interface DragAndDropProps {
  onFileDrop: (file: File) => Promise<void>;
  label: string;
}

export function DragAndDrop({ onFileDrop, label }: DragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    try {
      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find((file) => file.type === 'text/csv');

      if (csvFile) {
        await onFileDrop(csvFile);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={classNames(
        CLASSES.base,
        isDragging ? CLASSES.state.dragging : CLASSES.state.default
      )}
    >
      {label}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
