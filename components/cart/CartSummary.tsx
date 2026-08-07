'use client';

import React from 'react';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';

interface CartSummaryProps {
  totalPrice: number;
  totalItems: number;
  onClearCart: () => void;
  onClose: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,
  totalItems,
  onClearCart,
  onClose,
}) => {
  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 sm:p-6 space-y-3.5 shadow-lg">
      {/* Subtotal row */}
      <div className="flex items-center justify-between text-sm gap-2">
        <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">
          Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </span>
        <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-manrope shrink-0">
          {formatCurrency(totalPrice)}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80 gap-2">
        <span>Taxes & Shipping</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right shrink-0">Calculated at checkout</span>
      </div>

      {/* Trust banner */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
        <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" aria-hidden="true" />
        <span className="leading-snug">100% Genuine Certified Pharmaceutical Products</span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {/* Disabled Checkout (Coming Soon) Button */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs sm:text-sm cursor-not-allowed border border-slate-300 dark:border-slate-700 opacity-90"
          title="Payment and online checkout system is coming soon"
        >
          <span>Checkout (Coming Soon)</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm px-2 truncate"
          >
            Continue Shopping
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            leftIcon={<Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs sm:text-sm px-2 truncate"
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
