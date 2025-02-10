import { useState } from 'react';
import classNames from 'classnames';

const CLASSES = {
  base: [
    'border-2',
    'border-dashed',
    'rounded-lg',
    'p-8',
    'text-center',
    'cursor-pointer',
    'mt-4'
  ],
  state: {
    dragging: [
      'border-blue-500',
      'bg-blue-50'
    ],
    default: [
      'border-gray-300',
      'bg-white',
      'hover:border-gray-400'
    ]
  }
} as const;

interface DragAndDropProps {
  onFileDrop: (file: File) => void;
  label: string;
}

export function DragAndDrop({ onFileDrop, label }: DragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv');
    
    if (csvFile) {
      onFileDrop(csvFile);
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
    </div>
  );
} 