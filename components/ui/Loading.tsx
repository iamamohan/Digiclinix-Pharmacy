import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'fullPage';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  className,
}) => {
  const spinnerSizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    fullPage: 'w-14 h-14 border-4',
  }[size];

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-6 text-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-purple-600 dark:border-purple-400 border-t-transparent dark:border-t-transparent',
          spinnerSizeClass
        )}
        role="status"
        aria-label={text}
      />
      {text && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (size === 'fullPage') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
};
