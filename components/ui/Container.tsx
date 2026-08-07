import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  children,
  className,
  ...props
}) => {
  return (
    <Component
      className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full', className)}
      {...props}
    >
      {children}
    </Component>
  );
};
