'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductFormData } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { ProductImageUpload } from './ProductImageUpload';
import { ProductSEOForm } from '@/components/admin/ProductSEOForm';
import { getStockStatusBadgeInfo } from '@/lib/utils/inventory';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

export interface ProductFormProps {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stockQuantity?: string;
  lowStockThreshold?: string;
  discount?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitText = 'Save Product',
  onCancel,
}) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [price, setPrice] = useState(initialValues?.price !== undefined ? String(initialValues.price) : '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialValues?.imageUrl || undefined);
  const [imagePublicId, setImagePublicId] = useState<string | undefined>(initialValues?.imagePublicId || undefined);
  const [inStock, setInStock] = useState(initialValues?.inStock ?? true);
  const [requiresPrescription, setRequiresPrescription] = useState(initialValues?.requiresPrescription ?? false);

  // Phase 10B Inventory & Pricing Form State
  const [stockQuantity, setStockQuantity] = useState<string>(
    initialValues?.stockQuantity !== undefined
      ? String(initialValues.stockQuantity)
      : initialValues?.inStock === false
      ? '0'
      : '10'
  );
  const [lowStockThreshold, setLowStockThreshold] = useState<string>(
    initialValues?.lowStockThreshold !== undefined ? String(initialValues.lowStockThreshold) : '5'
  );
  const [discount, setDiscount] = useState<string>(
    initialValues?.discount !== undefined ? String(initialValues.discount) : '0'
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialValues?.isFeatured ?? false);
  const [isActive, setIsActive] = useState<boolean>(initialValues?.isActive ?? true);

  // Phase 10E Medical & SEO Form State
  const [uses, setUses] = useState(initialValues?.uses || '');
  const [warnings, setWarnings] = useState(initialValues?.warnings || '');
  const [seoTitle, setSeoTitle] = useState(initialValues?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialValues?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(initialValues?.seoKeywords || '');

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const stockQuantityRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setCategory(initialValues.category || '');
      setPrice(initialValues.price !== undefined ? String(initialValues.price) : '');
      setDescription(initialValues.description || '');
      setImageUrl(initialValues.imageUrl || undefined);
      setImagePublicId(initialValues.imagePublicId || undefined);
      setInStock(initialValues.inStock ?? true);
      setRequiresPrescription(initialValues.requiresPrescription ?? false);
      setStockQuantity(
        initialValues.stockQuantity !== undefined
          ? String(initialValues.stockQuantity)
          : initialValues.inStock === false
          ? '0'
          : '10'
      );
      setLowStockThreshold(
        initialValues.lowStockThreshold !== undefined ? String(initialValues.lowStockThreshold) : '5'
      );
      setDiscount(initialValues.discount !== undefined ? String(initialValues.discount) : '0');
      setIsFeatured(initialValues.isFeatured ?? false);
      setIsActive(initialValues.isActive ?? true);
      setUses(initialValues.uses || '');
      setWarnings(initialValues.warnings || '');
      setSeoTitle(initialValues.seoTitle || '');
      setSeoDescription(initialValues.seoDescription || '');
      setSeoKeywords(initialValues.seoKeywords || '');
    }
  }, [initialValues]);

  // Derived stock status badge preview
  const numStock = parseInt(stockQuantity, 10);
  const numThresh = parseInt(lowStockThreshold, 10);
  const safeStock = isNaN(numStock) ? 0 : numStock;
  const safeThresh = isNaN(numThresh) ? 5 : numThresh;
  const stockBadge = getStockStatusBadgeInfo(safeStock, safeThresh);

  // Derived discount preview calculation
  const discountCalc = calculateDiscountedPrice(price || 0, discount || 0);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }

    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice)) {
      newErrors.price = 'Valid price is required';
    } else if (numPrice <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    const parsedStock = parseInt(stockQuantity, 10);
    if (stockQuantity === '' || isNaN(parsedStock)) {
      newErrors.stockQuantity = 'Stock quantity must be an integer';
    } else if (parsedStock < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    const parsedThresh = parseInt(lowStockThreshold, 10);
    if (lowStockThreshold === '' || isNaN(parsedThresh)) {
      newErrors.lowStockThreshold = 'Low stock threshold must be an integer';
    } else if (parsedThresh < 0) {
      newErrors.lowStockThreshold = 'Low stock threshold cannot be negative';
    }

    const parsedDiscount = parseFloat(discount);
    if (discount !== '' && (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100%';
    }

    setErrors(newErrors);

    if (newErrors.name) {
      nameInputRef.current?.focus();
    } else if (newErrors.category) {
      categoryInputRef.current?.focus();
    } else if (newErrors.price) {
      priceInputRef.current?.focus();
    } else if (newErrors.stockQuantity) {
      stockQuantityRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSEOChange = (field: string, value: string) => {
    switch (field) {
      case 'uses':
        setUses(value);
        break;
      case 'warnings':
        setWarnings(value);
        break;
      case 'seoTitle':
        setSeoTitle(value);
        break;
      case 'seoDescription':
        setSeoDescription(value);
        break;
      case 'seoKeywords':
        setSeoKeywords(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isUploading) return;

    const parsedStock = parseInt(stockQuantity, 10);

    const data: ProductFormData = {
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      description: description.trim() || undefined,
      imageUrl: imageUrl || undefined,
      imagePublicId: imagePublicId || undefined,
      inStock: inStock && parsedStock > 0,
      requiresPrescription,
      stockQuantity: parsedStock,
      lowStockThreshold: parseInt(lowStockThreshold, 10),
      discount: parseFloat(discount) || 0,
      isFeatured,
      isActive,
      uses: uses.trim() || undefined,
      warnings: warnings.trim() || undefined,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      seoKeywords: seoKeywords.trim() || undefined,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Product Name */}
      <div>
        <label
          htmlFor="product-form-name"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          ref={nameInputRef}
          id="product-form-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="e.g. Paracetamol 500mg Tablets"
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
      </div>

      {/* Category & Price (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="product-form-category"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <input
            ref={categoryInputRef}
            id="product-form-category"
            type="text"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
            }}
            placeholder="e.g. Pain Relief"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.category && <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>}
        </div>

        <div>
          <label
            htmlFor="product-form-price"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Base Price (₹ / Base) <span className="text-red-500">*</span>
          </label>
          <input
            ref={priceInputRef}
            id="product-form-price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
            }}
            placeholder="e.g. 49.99"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.price && <p className="text-xs text-red-500 mt-1 font-medium">{errors.price}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="product-form-description"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Description (Optional)
        </label>
        <textarea
          id="product-form-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief product description or usage instructions..."
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Cloudinary Product Image Upload Component */}
      <ProductImageUpload
        currentImageUrl={imageUrl}
        currentImagePublicId={imagePublicId}
        onUploadStart={() => setIsUploading(true)}
        onUploadSuccess={(info) => {
          setIsUploading(false);
          setImageUrl(info.imageUrl);
          setImagePublicId(info.imagePublicId);
        }}
        onUploadError={() => setIsUploading(false)}
        onClear={() => {
          setImageUrl(undefined);
          setImagePublicId(undefined);
        }}
        disabled={isSubmitting}
      />

      {/* Phase 10B: Inventory & Pricing Management Section */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Inventory & Pricing Controls
          </span>

          {/* Stock Status Preview Badge */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Status Preview:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${stockBadge.badgeColorClass}`}
            >
              ● {stockBadge.label}
            </span>
          </div>
        </div>

        {/* Stock Quantity, Threshold & Discount (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Stock Quantity */}
          <div>
            <label
              htmlFor="product-form-stock-quantity"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
            >
              Stock Quantity
            </label>
            <input
              ref={stockQuantityRef}
              id="product-form-stock-quantity"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={stockQuantity}
              onChange={(e) => {
                setStockQuantity(e.target.value);
                if (errors.stockQuantity) setErrors((prev) => ({ ...prev, stockQuantity: undefined }));
              }}
              placeholder="e.g. 10"
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.stockQuantity && (
              <p className="text-[11px] text-red-500 mt-0.5 font-medium">{errors.stockQuantity}</p>
            )}
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label
              htmlFor="product-form-low-threshold"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
            >
              Low Stock Threshold
            </label>
            <input
              id="product-form-low-threshold"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={lowStockThreshold}
              onChange={(e) => {
                setLowStockThreshold(e.target.value);
                if (errors.lowStockThreshold) setErrors((prev) => ({ ...prev, lowStockThreshold: undefined }));
              }}
              placeholder="e.g. 5"
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.lowStockThreshold && (
              <p className="text-[11px] text-red-500 mt-0.5 font-medium">{errors.lowStockThreshold}</p>
            )}
          </div>

          {/* Discount Percentage */}
          <div>
            <label
              htmlFor="product-form-discount"
              className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
            >
              Discount (%)
            </label>
            <input
              id="product-form-discount"
              type="number"
              min="0"
              max="100"
              step="0.1"
              inputMode="decimal"
              value={discount}
              onChange={(e) => {
                setDiscount(e.target.value);
                if (errors.discount) setErrors((prev) => ({ ...prev, discount: undefined }));
              }}
              placeholder="e.g. 15"
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.discount && <p className="text-[11px] text-red-500 mt-0.5 font-medium">{errors.discount}</p>}
          </div>
        </div>

        {/* Discount Live Calculation Preview */}
        {discountCalc.hasDiscount && (
          <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 text-xs flex items-center justify-between text-purple-900 dark:text-purple-200">
            <span>
              Price Preview: <span className="line-through text-slate-400">{discountCalc.formattedOriginalPrice}</span>{' '}
              <span className="font-extrabold text-purple-600 dark:text-purple-400">{discountCalc.formattedDiscountedPrice}</span>
            </span>
            <span className="font-bold bg-purple-600 text-white px-2 py-0.5 rounded-md text-[10px]">
              {discountCalc.discountPercent}% OFF (Save {discountCalc.formattedSavingsAmount})
            </span>
          </div>
        )}

        {/* Switches: Featured & Active */}
        <div className="pt-2 flex flex-wrap items-center gap-5 border-t border-slate-200/60 dark:border-slate-800/60">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-slate-700"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              Featured Product
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-slate-700"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              {isActive ? (
                <Eye className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              )}
              Active Product
            </span>
          </label>
        </div>
      </div>

      {/* Toggles: In Stock & Rx Required */}
      <div className="pt-1 flex flex-col sm:flex-row gap-4 sm:items-center">
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-slate-700"
          />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">In Stock (Legacy Sync)</span>
        </label>

        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresPrescription}
            onChange={(e) => setRequiresPrescription(e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-slate-700"
          />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Prescription Required (Rx)
          </span>
        </label>
      </div>

      {/* Phase 10E Medical Information & SEO Form with Live Google Preview */}
      <ProductSEOForm
        productName={name}
        slug={initialValues?.name === name ? undefined : name}
        uses={uses}
        warnings={warnings}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        seoKeywords={seoKeywords}
        onChange={handleSEOChange}
      />

      {/* Form Buttons */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={isSubmitting || isUploading}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={isSubmitting || isUploading}
        >
          {isUploading ? 'Uploading Image...' : isSubmitting ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
};
