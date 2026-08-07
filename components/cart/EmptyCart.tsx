'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyCartProps {
  onClose: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50 shadow-soft">
          <ShoppingBag className="w-10 h-10" aria-hidden="true" />
        </div>
        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
          0
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-manrope">
        Your cart is empty
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
        Looks like you haven't added any medicines or health supplies to your cart yet.
      </p>

      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/products"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-soft focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>

        <Button
          variant="outline"
          size="md"
          onClick={onClose}
          className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
