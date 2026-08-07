'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductFormData } from '@/types/product';
import { Button } from '@/components/ui/Button';

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
  imageUrl?: string;
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
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || '');
  const [inStock, setInStock] = useState(initialValues?.inStock ?? true);
  const [requiresPrescription, setRequiresPrescription] = useState(initialValues?.requiresPrescription ?? false);

  const [errors, setErrors] = useState<FormErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const imageUrlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setCategory(initialValues.category || '');
      setPrice(initialValues.price !== undefined ? String(initialValues.price) : '');
      setDescription(initialValues.description || '');
      setImageUrl(initialValues.imageUrl || '');
      setInStock(initialValues.inStock ?? true);
      setRequiresPrescription(initialValues.requiresPrescription ?? false);
    }
  }, [initialValues]);

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

    if (imageUrl.trim() && !/^https?:\/\/.+/i.test(imageUrl.trim())) {
      newErrors.imageUrl = 'Image URL must start with http:// or https://';
    }

    setErrors(newErrors);

    // Focus the first invalid field (Recommendation 8)
    if (newErrors.name) {
      nameInputRef.current?.focus();
    } else if (newErrors.category) {
      categoryInputRef.current?.focus();
    } else if (newErrors.price) {
      priceInputRef.current?.focus();
    } else if (newErrors.imageUrl) {
      imageUrlInputRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: ProductFormData = {
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      inStock,
      requiresPrescription,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Product Name */}
      <div>
        <label htmlFor="product-form-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
      </div>

      {/* Category & Price (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="product-form-category" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.category && <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="product-form-price" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Price ($) <span className="text-red-500">*</span>
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
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && <p className="text-xs text-red-500 mt-1 font-medium">{errors.price}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="product-form-description" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Description (Optional)
        </label>
        <textarea
          id="product-form-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief product description or usage instructions..."
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="product-form-image" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Image URL (Optional)
        </label>
        <input
          ref={imageUrlInputRef}
          id="product-form-image"
          type="url"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: undefined }));
          }}
          placeholder="https://example.com/product-image.jpg"
          className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.imageUrl && <p className="text-xs text-red-500 mt-1 font-medium">{errors.imageUrl}</p>}
      </div>

      {/* Toggles: In Stock & Rx Required */}
      <div className="pt-2 flex flex-col sm:flex-row gap-4 sm:items-center">
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
          />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">In Stock</span>
        </label>

        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresPrescription}
            onChange={(e) => setRequiresPrescription(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
          />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Prescription Required (Rx)</span>
        </label>
      </div>

      {/* Form Buttons */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
};
