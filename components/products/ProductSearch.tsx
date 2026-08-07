'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onImmediateSearch?: (value: string) => void;
  className?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  value: externalValue,
  onChange,
  onImmediateSearch,
  className,
}) => {
  const [inputValue, setInputValue] = useState(externalValue);
  const isInitialMount = useRef(true);

  // Synchronize internal state with external prop changes (e.g., URL clear/reset)
  useEffect(() => {
    setInputValue(externalValue);
  }, [externalValue]);

  // 300ms Debounce timer
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (inputValue === externalValue) return;

    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, externalValue, onChange]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    } else if (e.key === 'Enter') {
      if (onImmediateSearch) {
        onImmediateSearch(inputValue);
      } else {
        onChange(inputValue);
      }
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <label htmlFor="product-search-input" className="sr-only">
        Search medicines and healthcare products
      </label>
      <div className="relative flex items-center">
        <Search
          className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="product-search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search medicines, vitamins, products..."
          className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Clear search text"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
