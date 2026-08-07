import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Container } from './Container';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  containerClassName?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  description,
  className,
  containerClassName,
}) => {
  return (
    <div className={cn('min-h-screen py-8 md:py-12 transition-colors duration-200', className)}>
      <Container className={containerClassName}>
        {(title || description) && (
          <div className="mb-8 md:mb-10 text-center md:text-left border-b border-slate-200 dark:border-slate-800 pb-6">
            {title && (
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </div>
  );
};
