import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogBody: React.FC<DialogBodyProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6 overflow-y-auto flex-1 custom-scrollbar', className)}>
      {children}
    </div>
  );
};
