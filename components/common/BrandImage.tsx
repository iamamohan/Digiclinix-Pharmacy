import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface BrandImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
}

export const BrandImage: React.FC<BrandImageProps> = ({
  src,
  alt,
  width = 280,
  height = 80,
  priority = false,
  className,
  containerClassName,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-2xl bg-white p-3 sm:p-3.5 shadow-soft border border-slate-100/80',
        containerClassName
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn('w-auto h-auto max-w-full object-contain', className)}
      />
    </div>
  );
};
