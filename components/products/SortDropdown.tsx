'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SortDropdownProps {
  sortBy?: 'createdAt' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: 'createdAt' | 'price' | 'name', sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest Arrivals', sortBy: 'createdAt', sortOrder: 'desc' },
  { value: 'name:asc', label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' },
  { value: 'price:asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price:desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
] as const;

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSortChange,
  className,
}) => {
  const currentValue = `${sortBy}:${sortOrder}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const option = SORT_OPTIONS.find((opt) => opt.value === val);
    if (option) {
      onSortChange(option.sortBy, option.sortOrder);
    }
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <label htmlFor="sort-dropdown-select" className="sr-only">
        Sort products by
      </label>
      <div className="relative flex items-center w-full">
        <ArrowUpDown className="absolute left-3 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" aria-hidden="true" />
        <select
          id="sort-dropdown-select"
          value={currentValue}
          onChange={handleChange}
          className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
