'use client';

import React, { useState } from 'react';
import { RotateCcw, Filter, Sparkles, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

export type StockStatusFilter = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface ProductFiltersProps {
  categories: string[];
  selectedCategory?: string;
  selectedStockStatus?: StockStatusFilter;
  selectedFeatured?: boolean;
  selectedOnSale?: boolean;
  selectedPrescription?: boolean;
  onCategoryChange: (category?: string) => void;
  onStockStatusChange: (status: StockStatusFilter) => void;
  onFeaturedChange: (featured?: boolean) => void;
  onOnSaleChange: (onSale?: boolean) => void;
  onPrescriptionChange: (requiresPrescription?: boolean) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  activeFilterCount?: number;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  selectedStockStatus = 'ALL',
  selectedFeatured,
  selectedOnSale,
  selectedPrescription,
  onCategoryChange,
  onStockStatusChange,
  onFeaturedChange,
  onOnSaleChange,
  onPrescriptionChange,
  onClearAll,
  hasActiveFilters,
  activeFilterCount = 0,
  className,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const filterControls = (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Category Dropdown Filter */}
      <div className="relative">
        <label htmlFor="filter-category-select" className="sr-only">
          Filter by category
        </label>
        <select
          id="filter-category-select"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Availability Filter */}
      <div className="relative">
        <label htmlFor="filter-stock-select" className="sr-only">
          Filter by availability status
        </label>
        <select
          id="filter-stock-select"
          value={selectedStockStatus}
          onChange={(e) => onStockStatusChange(e.target.value as StockStatusFilter)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
        >
          <option value="ALL">All Availability</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Featured Toggle Button */}
      <button
        type="button"
        onClick={() => onFeaturedChange(selectedFeatured ? undefined : true)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-amber-500',
          selectedFeatured
            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
            : 'bg-white dark:bg-[#111827] border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-amber-400'
        )}
      >
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Featured</span>
      </button>

      {/* On Sale Toggle Button */}
      <button
        type="button"
        onClick={() => onOnSaleChange(selectedOnSale ? undefined : true)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500',
          selectedOnSale
            ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
            : 'bg-white dark:bg-[#111827] border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-purple-400'
        )}
      >
        <Tag className="w-3.5 h-3.5" aria-hidden="true" />
        <span>On Sale</span>
      </button>

      {/* Prescription Requirement Filter */}
      <div className="relative">
        <label htmlFor="filter-prescription-select" className="sr-only">
          Filter by prescription requirement
        </label>
        <select
          id="filter-prescription-select"
          value={selectedPrescription === undefined ? '' : String(selectedPrescription)}
          onChange={(e) => {
            const val = e.target.value;
            onPrescriptionChange(val === '' ? undefined : val === 'true');
          }}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
        >
          <option value="">Rx: All</option>
          <option value="true">Rx Required</option>
          <option value="false">No Rx</option>
        </select>
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200/60 dark:border-red-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Clear all active filters"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );

  return (
    <div className={cn('relative', className)}>
      {/* Desktop Filter Bar (Hidden on Mobile) */}
      <div className="hidden lg:block">{filterControls}</div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsMobileDrawerOpen(true)}
          leftIcon={<Filter className="w-4 h-4 text-purple-600" aria-hidden="true" />}
          className="text-xs font-bold"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-purple-600 text-white rounded-full font-extrabold">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-[#111827] rounded-t-3xl p-6 space-y-5 shadow-2xl border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" aria-hidden="true" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-manrope">
                  Filter Products
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Filter Body */}
            <div className="space-y-4">{filterControls}</div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    onClearAll();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-1/2"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsMobileDrawerOpen(false)}
                className={hasActiveFilters ? 'w-1/2' : 'w-full'}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
