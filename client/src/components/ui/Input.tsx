import { InputHTMLAttributes } from 'react';

const CLASSES = {
  label: 'flex flex-col gap-2 text-sm font-medium text-gray-700',
  input:
    'px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
} as const;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <label className={CLASSES.label}>
      {label}
      <input className={CLASSES.input} {...props} />
    </label>
  );
}
