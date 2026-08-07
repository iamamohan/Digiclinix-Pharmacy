import React from 'react';
import { Package } from 'lucide-react';

export interface ProductsSummaryProps {
  totalItems: number;
  pageSize?: number;
  page?: number;
  currentItemsCount?: number;
  search?: string;
  category?: string;
}

export const ProductsSummary: React.FC<ProductsSummaryProps> = ({
  totalItems,
  pageSize = 12,
  page = 1,
  currentItemsCount,
  search,
  category,
}) => {
  const count = currentItemsCount !== undefined ? currentItemsCount : totalItems;

  const start = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = totalItems > 0 ? Math.min(page * pageSize, totalItems) : 0;

  const renderContextText = () => {
    if (search) {
      return (
        <>
          Showing <span className="font-bold text-blue-600 dark:text-blue-400">{count}</span> Search Results for &ldquo;
          <span className="italic">{search}</span>&rdquo;
        </>
      );
    }

    if (category) {
      return (
        <>
          Showing <span className="font-bold text-blue-600 dark:text-blue-400">{count}</span> {category} Products
        </>
      );
    }

    if (totalItems > pageSize) {
      return (
        <>
          Showing <span className="font-bold text-blue-600 dark:text-blue-400">{start}&ndash;{end}</span> of{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">{totalItems}</span> Certified Healthcare Products
        </>
      );
    }

    return (
      <>
        Showing <span className="font-bold text-blue-600 dark:text-blue-400">{totalItems}</span> Certified Healthcare Products
      </>
    );
  };

  return (
    <div className="flex items-center justify-between py-3.5 mb-6 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 font-manrope">
          {renderContextText()}
        </span>
      </div>
    </div>
  );
};
