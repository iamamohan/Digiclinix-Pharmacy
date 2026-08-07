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
import { SerializedProduct } from '@/types/product';
import { CheckCircle2, XCircle, FileText, Calendar, Tag, Hash } from 'lucide-react';

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

  useEffect(() => {
    if (product) {
      setImgSrc(product.imageUrl || DEFAULT_IMAGE);
    }
  }, [product]);

  if (!product) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabelledBy="product-details-title">
      <DialogHeader
        title={product.name}
        subtitle="Complete Product Specifications & Info"
        onClose={onClose}
        titleId="product-details-title"
      />

      <DialogBody className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Image Panel — Fixed aspect ratio to prevent CLS */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              onError={() => setImgSrc(DEFAULT_IMAGE)}
            />

            {product.requiresPrescription && (
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="warning" size="md">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Rx Required</span>
                </Badge>
              </div>
            )}
          </div>

          {/* Details Metadata */}
          <div className="space-y-4">
            {/* Category & Stock Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="primary" size="md">
                <Tag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{product.category}</span>
              </Badge>

              {product.inStock ? (
                <Badge variant="success" size="md">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>In Stock</span>
                </Badge>
              ) : (
                <Badge variant="danger" size="md">
                  <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Out of Stock</span>
                </Badge>
              )}
            </div>

            {/* Price Display */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Unit Price</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-manrope">
                {formatCurrency(product.price)}
              </span>
            </div>

            {/* Description Paragraph */}
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
        {onEdit && (
          <Button
            variant="primary"
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
