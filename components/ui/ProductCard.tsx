'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SerializedProduct } from '@/types/product';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { CheckCircle2, XCircle, FileText, ArrowRight, Pencil, Trash2, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { useToast } from '@/components/providers/toast-provider';

export interface ProductCardProps {
  product: SerializedProduct;
  onViewDetails?: (product: SerializedProduct) => void;
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
  onViewDetails,
  onEdit,
  onDelete,
  className,
}) => {
  const initialImage = getProductImage(product);
  const [imgSrc, setImgSrc] = useState(initialImage);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { success } = useToast();

  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    setIsAdding(true);
    success(`✓ ${product.name} added to your cart`);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div
      className={cn(
        'group p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full select-none',
        className
      )}
    >
      <div>
        {/* Product Image Container */}
        <div
          onClick={handleCardClick}
          className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-4 border border-slate-100 dark:border-slate-800/60 cursor-pointer"
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

          {/* Prescription Badge Overlay */}
          {product.requiresPrescription && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <Badge variant="warning" size="sm">
                <FileText className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Rx Required</span>
              </Badge>
            </div>
          )}

          {/* Action Overlay Buttons (Edit & Delete) */}
          {(onEdit || onDelete) && (
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
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
        </div>

        {/* Category Tag & Stock Status */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-200/50 dark:border-purple-800/50 truncate max-w-[60%]">
            {product.category}
          </span>

          {product.inStock ? (
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>In Stock</span>
            </Badge>
          ) : (
            <Badge variant="danger" size="sm">
              <XCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>Out of Stock</span>
            </Badge>
          )}
        </div>

        {/* Product Title */}
        <button
          type="button"
          onClick={handleCardClick}
          className="text-left w-full group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors focus:outline-none focus:underline"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-manrope line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </button>

        {/* Description Snippet */}
        {product.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {/* Footer: Price & CTA Actions */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Price</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white font-manrope">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCardClick}
              className="text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-2"
              aria-label={`View details for ${product.name}`}
            >
              View
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            disabled={!product.inStock || isAdding}
            onClick={handleAddToCart}
            leftIcon={
              isAdding ? (
                <Check className="w-3.5 h-3.5 text-white animate-bounce" aria-hidden="true" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              )
            }
            className={cn(
              'transition-all duration-200 text-xs px-3 font-semibold shadow-xs',
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
