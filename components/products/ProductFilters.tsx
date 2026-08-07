'use client';

import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ProductFiltersProps {
  categories: string[];
  selectedCategory?: string;
  selectedInStock?: boolean;
  selectedPrescription?: boolean;
  onCategoryChange: (category?: string) => void;
  onInStockChange: (inStock?: boolean) => void;
  onPrescriptionChange: (requiresPrescription?: boolean) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  selectedInStock,
  selectedPrescription,
  onCategoryChange,
  onInStockChange,
  onPrescriptionChange,
  onClearAll,
  hasActiveFilters,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Category Dropdown Filter */}
      <div className="relative">
        <label htmlFor="filter-category-select" className="sr-only">
          Filter by category
        </label>
        <select
          id="filter-category-select"
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
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
          Filter by availability
        </label>
        <select
          id="filter-stock-select"
          value={selectedInStock === undefined ? '' : String(selectedInStock)}
          onChange={(e) => {
            const val = e.target.value;
            onInStockChange(val === '' ? undefined : val === 'true');
          }}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Availability</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

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
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Products</option>
          <option value="true">Rx Required</option>
          <option value="false">No Rx Required</option>
        </select>
      </div>

      {/* Visible Clear All Button */}
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
};
