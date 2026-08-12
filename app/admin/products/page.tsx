'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/providers/toast-provider';
import { getStockStatusBadgeInfo } from '@/lib/utils/inventory';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { ProductForm } from '@/components/products/ProductForm';
import { Modal } from '@/components/ui/Modal';
import { DialogHeader } from '@/components/ui/DialogHeader';
import { DialogBody } from '@/components/ui/DialogBody';
import { DialogFooter } from '@/components/ui/DialogFooter';
import { SerializedProduct, ProductFormData } from '@/types/product';
import { createProduct, updateProduct, deleteProduct } from '@/lib/api/products';
import { Search, Plus, Pencil, Trash2, RefreshCw, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<SerializedProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?pageSize=100');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.data);
      } else {
        toast.error(data.error?.message || 'Failed to load products');
      }
    } catch {
      toast.error('Network error loading products');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const res = await createProduct(formData);
      if (res.success) {
        toast.success(`Product "${formData.name}" created successfully`);
        setIsAddModalOpen(false);
        await fetchProducts();
      } else {
        toast.error(res.error?.message || 'Failed to create product');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (formData: ProductFormData) => {
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      const res = await updateProduct(editingProduct.id, formData);
      if (res.success) {
        toast.success(`Product "${formData.name}" updated successfully`);
        setEditingProduct(null);
        await fetchProducts();
      } else {
        toast.error(res.error?.message || 'Failed to update product');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsSubmitting(true);
    try {
      const res = await deleteProduct(deletingProduct.id);
      if (res.success) {
        toast.success(`Product deleted successfully`);
        setDeletingProduct(null);
        await fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-manrope">
            Product Inventory Management Table
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dedicated administrative table for creating, editing, and managing healthcare products.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, category, or slug..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* High-Density Management Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-sm font-semibold animate-pulse">
          Loading products inventory...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">No products match your search.</div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Stock Quantity</th>
                  <th className="p-3.5">Stock Status</th>
                  <th className="p-3.5">Base Price</th>
                  <th className="p-3.5">Discount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProducts.map((product) => {
                  const stockQuantity = product.stockQuantity ?? (product.inStock ? 10 : 0);
                  const threshold = product.lowStockThreshold ?? 5;
                  const stockBadge = getStockStatusBadgeInfo(stockQuantity, threshold);
                  const discountCalc = calculateDiscountedPrice(product.price, product.discount ?? 0);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{product.name}</span>
                          {product.isFeatured && (
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                        {product.category}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {stockQuantity} units
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${stockBadge.badgeColorClass}`}
                        >
                          ● {stockBadge.label}
                        </span>
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900 dark:text-white font-manrope">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="p-3.5">
                        {discountCalc.hasDiscount ? (
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {discountCalc.discountPercent}% OFF
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {product.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-semibold">
                            <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="lg">
          <DialogHeader title="Add New Product" subtitle="Create a new healthcare product entry" onClose={() => setIsAddModalOpen(false)} />
          <DialogBody>
            <ProductForm onSubmit={handleAdd} isSubmitting={isSubmitting} onCancel={() => setIsAddModalOpen(false)} />
          </DialogBody>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal isOpen={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} size="lg">
          <DialogHeader title={`Edit Product: ${editingProduct.name}`} subtitle="Update inventory, price, or details" onClose={() => setEditingProduct(null)} />
          <DialogBody>
            <ProductForm
              initialValues={{
                name: editingProduct.name,
                category: editingProduct.category,
                price: Number(editingProduct.price),
                description: editingProduct.description || undefined,
                imageUrl: editingProduct.imageUrl || undefined,
                imagePublicId: editingProduct.imagePublicId || undefined,
                inStock: editingProduct.inStock,
                requiresPrescription: editingProduct.requiresPrescription,
                stockQuantity: editingProduct.stockQuantity,
                lowStockThreshold: editingProduct.lowStockThreshold,
                discount: Number(editingProduct.discount),
                isFeatured: editingProduct.isFeatured,
                isActive: editingProduct.isActive,
                uses: editingProduct.uses || undefined,
                warnings: editingProduct.warnings || undefined,
                seoTitle: editingProduct.seoTitle || undefined,
                seoDescription: editingProduct.seoDescription || undefined,
                seoKeywords: editingProduct.seoKeywords || undefined,
              }}
              onSubmit={handleUpdate}
              isSubmitting={isSubmitting}
              onCancel={() => setEditingProduct(null)}
            />
          </DialogBody>
        </Modal>
      )}

      {/* Delete Product Dialog */}
      {deletingProduct && (
        <Modal isOpen={Boolean(deletingProduct)} onClose={() => setDeletingProduct(null)} size="sm">
          <DialogHeader title="Delete Product" subtitle="Confirm product removal" onClose={() => setDeletingProduct(null)} />
          <DialogBody className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p>Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deletingProduct.name}</strong>?</p>
            <p className="text-red-500 font-semibold">This action cannot be undone.</p>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete} isLoading={isSubmitting}>
              Delete Product
            </Button>
          </DialogFooter>
        </Modal>
      )}
    </div>
  );
}
