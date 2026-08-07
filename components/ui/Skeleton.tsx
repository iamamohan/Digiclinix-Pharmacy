import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800/80',
        className
      )}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft flex flex-col justify-between space-y-4">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-48 rounded-xl" />

      {/* Badges Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>

      {/* Title & Category Skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-5 rounded-md" />
        <Skeleton className="w-1/2 h-4 rounded-md" />
      </div>

      {/* Price & Button Skeleton */}
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="w-20 h-6 rounded-md" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};
