'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SerializedProduct } from '@/types/product';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/format';
import { getStockStatusBadgeInfo, getCustomerStockStatusBadgeInfo } from '@/lib/utils/inventory';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { cn } from '@/lib/utils/cn';
import { FileText, Pencil, Trash2, ShoppingBag, Check, Sparkles, EyeOff } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { useToast } from '@/components/providers/toast-provider';

export interface ProductCardProps {
  product: SerializedProduct;
  onEdit?: (product: SerializedProduct) => void;
  onDelete?: (product: SerializedProduct) => void;
  className?: string;
}

const getProductImage = (product: SerializedProduct): string => {
  if (product.imageUrl && product.imageUrl !== '/images/hero/hero-1.png') {
    return product.imageUrl;
  }

  const name = product.name.toLowerCase();
  const slug = product.slug?.toLowerCase() || '';
  const category = product.category?.toLowerCase() || '';

  if (slug.includes('paracetamol') || name.includes('paracetamol') || category.includes('pain')) {
    return '/images/products/paracetamol.png';
  }
  if (slug.includes('amoxicillin') || name.includes('amoxicillin') || category.includes('antibiotic')) {
    return '/images/products/amoxicillin.png';
  }
  if (slug.includes('vitamin') || name.includes('vitamin') || category.includes('vitamin')) {
    return '/images/products/vitamin-d3.png';
  }
  if (slug.includes('omeprazole') || name.includes('omeprazole') || category.includes('digest')) {
    return '/images/products/omeprazole.png';
  }
  if (slug.includes('cetirizine') || name.includes('cetirizine') || category.includes('allergy')) {
    return '/images/products/cetirizine.png';
  }
  if (slug.includes('metformin') || name.includes('metformin') || category.includes('diabet')) {
    return '/images/products/metformin.png';
  }

  return '/images/products/paracetamol.png';
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  className,
}) => {
  const initialImage = getProductImage(product);
  const [imgSrc, setImgSrc] = useState(initialImage);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { success } = useToast();

  const isAdminView = Boolean(onEdit || onDelete);
  const detailHref = `/products/${product.slug}`;

  // Customer sees In Stock / Out of Stock only. Admin sees full stock info incl. Low Stock.
  const stockQuantityNum = product.stockQuantity ?? (product.inStock ? 10 : 0);
  const stockInfo = isAdminView
    ? getStockStatusBadgeInfo(stockQuantityNum, product.lowStockThreshold ?? 5)
    : getCustomerStockStatusBadgeInfo(stockQuantityNum);

  // Derived discount pricing (does NOT modify DB price)
  const discountCalc = calculateDiscountedPrice(product.price, product.discount ?? 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock || stockInfo.status === 'OUT_OF_STOCK') return;
    addItem(product);
    setIsAdding(true);
    success(`✓ ${product.name} added to your cart`);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div
      className={cn(
        'group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full select-none relative',
        !product.isActive && isAdminView && 'opacity-75 bg-slate-50/80 dark:bg-slate-900/40',
        className
      )}
    >
      <div>
        {/* Product Image Link */}
        <Link
          href={detailHref}
          className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-3.5 border border-slate-100 dark:border-slate-800/60 cursor-pointer block"
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgSrc('/images/products/paracetamol.png')}
          />

          {/* Top Left Badges: Rx only (no Featured for customers) */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
            {product.requiresPrescription && (
              <Badge variant="warning" size="sm">
                <FileText className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Rx Required</span>
              </Badge>
            )}

            {isAdminView && product.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs">
                <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Featured</span>
              </span>
            )}

            {isAdminView && !product.isActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-white px-2 py-0.5 rounded-md shadow-xs">
                <EyeOff className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Inactive</span>
              </span>
            )}
          </div>

          {/* Discount Badge Overlay (Bottom Right of Image) */}
          {discountCalc.hasDiscount && (
            <div className="absolute bottom-2.5 right-2.5 z-10">
              <span className="inline-flex items-center text-[10px] font-extrabold bg-purple-600 text-white px-2 py-0.5 rounded-md shadow-md">
                {discountCalc.discountPercent}% OFF
              </span>
            </div>
          )}

          {/* Admin Action Overlay Buttons (Edit & Delete) */}
          {isAdminView && (
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onEdit(product);
                  }}
                  className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Edit product details for ${product.name}`}
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(product);
                  }}
                  className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Delete product ${product.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </Link>

        {/* Category Tag & Stock Status Badge Row */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/50 dark:border-purple-800/50 truncate shrink min-w-0">
            {product.category}
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap shrink-0 ${stockInfo.badgeColorClass}`}
          >
            <span className="text-[9px]">●</span>
            <span>{stockInfo.label}</span>
            {isAdminView && product.stockQuantity !== undefined && (
              <span className="opacity-90 font-semibold">({product.stockQuantity})</span>
            )}
          </span>
        </div>

        {/* Product Title Link */}
        <Link
          href={detailHref}
          className="text-left w-full group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors focus:outline-none focus:underline mt-1 block"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-manrope line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed min-h-[2.25rem]">
          {product.description || 'Quality pharmaceutical healthcare product.'}
        </p>
      </div>

      {/* Footer: Clean Price & Action Buttons */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex flex-col justify-center min-w-0">
          {discountCalc.hasDiscount ? (
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-extrabold text-purple-600 dark:text-purple-400 font-manrope whitespace-nowrap">
                {discountCalc.formattedDiscountedPrice}
              </span>
              <span className="text-xs text-slate-400 line-through whitespace-nowrap">
                {discountCalc.formattedOriginalPrice}
              </span>
            </div>
          ) : (
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-manrope whitespace-nowrap">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={detailHref}
            className="inline-flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1.5 rounded-lg shrink-0 transition-colors"
            aria-label={`View details for ${product.name}`}
          >
            View
          </Link>

          <Button
            variant="primary"
            size="sm"
            disabled={!product.inStock || stockInfo.status === 'OUT_OF_STOCK' || isAdding}
            onClick={handleAddToCart}
            leftIcon={
              isAdding ? (
                <Check className="w-3.5 h-3.5 text-white animate-bounce" aria-hidden="true" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              )
            }
            className={cn(
              'transition-all duration-200 text-xs px-3 py-1.5 font-semibold shadow-xs whitespace-nowrap shrink-0',
              isAdding
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white scale-105'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdding ? 'Added!' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};
