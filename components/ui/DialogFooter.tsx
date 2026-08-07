import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
};
