import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';
import { PackageOpen, RefreshCw } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <PackageOpen className="w-12 h-12 text-slate-400 dark:text-slate-500" />,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-8 md:p-12 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 shadow-soft',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-manrope">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-md">
          {description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="outline"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        )}

        {(actionText && (actionHref || onAction)) && (
          <Button
            variant="primary"
            size="md"
            href={actionHref}
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};
