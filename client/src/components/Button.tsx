import React from 'react';
import classNames from 'classnames';

const CLASSES = {
  base: [
    'h-10',
    'text-white',
    'rounded-lg',
    'text-xl',
    'flex',
    'items-center',
    'justify-center',
    'px-4'
  ],
  variant: {
    primary: ['bg-blue-600', 'hover:bg-blue-700'],
    danger: ['bg-red-500', 'hover:bg-red-600'],
    warning: ['bg-yellow-600', 'hover:bg-yellow-700']
  }
} as const;

interface ButtonProps {
  onClick: () => void;
  variant?: keyof typeof CLASSES.variant;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  variant = 'primary',
  children 
}) => {
  return (
    <button 
      onClick={onClick}
      className={classNames(CLASSES.base, CLASSES.variant[variant])}
    >
      {children}
    </button>
  );
}; 
