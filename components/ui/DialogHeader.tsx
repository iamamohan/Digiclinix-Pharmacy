import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DialogHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  titleId?: string;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  title,
  subtitle,
  onClose,
  titleId,
  className,
}) => {
  return (
    <div
      className={cn(
        'px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 shrink-0',
        className
      )}
    >
      <div>
        <h2 id={titleId} className="text-xl font-bold text-slate-900 dark:text-white font-manrope">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
