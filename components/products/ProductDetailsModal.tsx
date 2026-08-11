'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { DialogHeader } from '@/components/ui/DialogHeader';
import { DialogBody } from '@/components/ui/DialogBody';
import { DialogFooter } from '@/components/ui/DialogFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/format';
import { getStockStatusBadgeInfo } from '@/lib/utils/inventory';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { useCart, getAvailableStock } from '@/components/providers/cart-provider';
import { SerializedProduct } from '@/types/product';
import { FileText, Calendar, Tag, Hash, Sparkles, Eye, EyeOff, Package, AlertTriangle, ShoppingBag, Plus, Minus, Check } from 'lucide-react';

export interface ProductDetailsModalProps {
  isOpen: boolean;
  product: SerializedProduct | null;
  onClose: () => void;
  onEdit?: (product: SerializedProduct) => void;
}

const DEFAULT_IMAGE = '/images/hero/hero-1.png';

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  product,
  onClose,
  onEdit,
}) => {
  const [imgSrc, setImgSrc] = useState(product?.imageUrl || DEFAULT_IMAGE);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem, items: cartItems } = useCart();

  useEffect(() => {
    if (product) {
      setImgSrc(product.imageUrl || DEFAULT_IMAGE);
      setSelectedQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const availableStock = getAvailableStock(product);
  const existingCartItem = cartItems.find((item) => item.product.id === product.id);
  const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
  const maxAddable = Math.max(0, availableStock - currentCartQty);
  const isOutOfStock = availableStock <= 0;
  const isAtMaxCartStock = currentCartQty >= availableStock;

  const formatDate = (dateStr: string | Date) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return String(dateStr);
    }
  };

  const stockInfo = getStockStatusBadgeInfo(availableStock, product.lowStockThreshold ?? 5);
  const discountCalc = calculateDiscountedPrice(product.price, product.discount ?? 0);

  const handleAddToCart = () => {
    if (isOutOfStock || isAtMaxCartStock || selectedQuantity <= 0) return;
    addItem(product, selectedQuantity);
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabelledBy="product-details-title">
      <DialogHeader
        title={product.name}
        subtitle="Complete Product Specifications & Inventory Details"
        onClose={onClose}
        titleId="product-details-title"
      />

      <DialogBody className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Image Panel */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              onError={() => setImgSrc(DEFAULT_IMAGE)}
            />

            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
              {product.requiresPrescription && (
                <Badge variant="warning" size="md">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Rx Required</span>
                </Badge>
              )}

              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-white px-2.5 py-1 rounded-lg shadow-md">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            {discountCalc.hasDiscount && (
              <div className="absolute bottom-3 right-3 z-10">
                <span className="inline-flex items-center text-xs font-extrabold bg-purple-600 text-white px-2.5 py-1 rounded-lg shadow-lg">
                  {discountCalc.discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Details & Inventory Specifications */}
          <div className="space-y-4">
            {/* Category & Stock Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="primary" size="md">
                <Tag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{product.category}</span>
              </Badge>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${stockInfo.badgeColorClass}`}
              >
                ● {stockInfo.label}
              </span>
            </div>

            {/* Price Display */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Price</span>
              <div className="flex items-baseline gap-2">
                {discountCalc.hasDiscount ? (
                  <>
                    <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-manrope">
                      {discountCalc.formattedDiscountedPrice}
                    </span>
                    <span className="text-base text-slate-400 line-through">
                      {discountCalc.formattedOriginalPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-manrope">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Phase 10B/10C Inventory Specifications */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Package className="w-3 h-3 text-purple-500" aria-hidden="true" />
                  Available Stock
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {availableStock} units
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" aria-hidden="true" />
                  Low Threshold
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {product.lowStockThreshold ?? 5} units
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
                  Featured Status
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {product.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  {product.isActive ? (
                    <Eye className="w-3 h-3 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  )}
                  Product Status
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Section */}
            {!isOutOfStock && (
              <div className="pt-3 p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={selectedQuantity <= 1}
                      className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((prev) => Math.min(maxAddable, prev + 1))}
                      disabled={selectedQuantity >= maxAddable}
                      className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {isAtMaxCartStock && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Maximum available stock ({availableStock} units) is already in your cart.
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Description</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-inter whitespace-pre-line">
                {product.description || 'No description provided for this healthcare item.'}
              </p>
            </div>

            {/* Metadata (Slug & Creation Date) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>Slug: <code className="text-slate-700 dark:text-slate-300 font-mono select-all">{product.slug}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span>Added on: {formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="outline" size="md" onClick={onClose}>
          Close
        </Button>

        {/* Add to Cart CTA */}
        <Button
          variant="primary"
          size="md"
          disabled={isOutOfStock || isAtMaxCartStock || isAdding}
          onClick={handleAddToCart}
          leftIcon={
            isAdding ? (
              <Check className="w-4 h-4 text-white animate-bounce" aria-hidden="true" />
            ) : (
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            )
          }
          className={isAdding ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}
        >
          {isAdding
            ? 'Added to Cart!'
            : isOutOfStock
            ? 'Out of Stock'
            : isAtMaxCartStock
            ? 'Max Stock in Cart'
            : `Add ${selectedQuantity} to Cart`}
        </Button>

        {onEdit && (
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            Edit Product
          </Button>
        )}
      </DialogFooter>
    </Modal>
  );
};
