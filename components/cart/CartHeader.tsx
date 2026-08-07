'use client';

import React from 'react';
import { ShoppingBag, X } from 'lucide-react';

interface CartHeaderProps {
  totalItems: number;
  onClose: () => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ totalItems, onClose }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="cart-drawer-title" className="text-lg font-bold text-slate-900 dark:text-white font-manrope">
            Shopping Cart
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Close cart drawer"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};
