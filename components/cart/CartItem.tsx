'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Trash2, FileText } from 'lucide-react';
import { CartItem as CartItemType } from '@/components/providers/cart-provider';
import { formatCurrency } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const DEFAULT_IMAGE = '/images/hero/hero-1.png';

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const { product, quantity } = item;
  const [imgSrc, setImgSrc] = useState(product.imageUrl || DEFAULT_IMAGE);

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price) || 0;
  const itemSubtotal = priceNum * quantity;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Product Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover object-center"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-manrope truncate">
            {product.name}
          </h3>
          <button
            type="button"
            onClick={() => onRemoveItem(product.id)}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            aria-label={`Remove ${product.name} from cart`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {product.requiresPrescription && (
          <div className="mt-0.5">
            <Badge variant="warning" size="sm" className="text-[10px] py-0 px-1.5">
              <FileText className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
              <span>Rx Required</span>
            </Badge>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {formatCurrency(product.price)} each
        </p>

        {/* Quantity Controls & Subtotal */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors focus:outline-none"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <Minus className="w-3 h-3" aria-hidden="true" />
            </button>
            <span className="w-7 text-center text-xs font-semibold text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors focus:outline-none"
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>

          <span className="text-sm font-extrabold text-slate-900 dark:text-white font-manrope">
            {formatCurrency(itemSubtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
