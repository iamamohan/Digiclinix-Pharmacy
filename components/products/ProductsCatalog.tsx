'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/components/providers/toast-provider';
import { ProductsSummary } from './ProductsSummary';
import { ProductGrid } from './ProductGrid';
import { ProductSearch } from './ProductSearch';
import { ProductFilters } from './ProductFilters';
import { SortDropdown } from './SortDropdown';
import { Pagination } from './Pagination';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';
import { DeleteProductDialog } from './DeleteProductDialog';
import { ProductDetailsModal } from './ProductDetailsModal';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { AlertCircle, PackageOpen, Plus } from 'lucide-react';
import { FetchProductsParams, createProduct, updateProduct, deleteProduct } from '@/lib/api/products';
import { SerializedProduct, ProductFormData } from '@/types/product';

const DEFAULT_PAGE_SIZE = 12;

export const ProductsCatalog: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const toast = useToast();

  // Extract current query parameters from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || undefined;
  const inStockParam = searchParams.get('inStock');
  const requiresPrescriptionParam = searchParams.get('requiresPrescription');
  const sortByParam = (searchParams.get('sortBy') as 'createdAt' | 'price' | 'name') || 'createdAt';
  const sortOrderParam = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const inStock = inStockParam === null ? undefined : inStockParam === 'true';
  const requiresPrescription = requiresPrescriptionParam === null ? undefined : requiresPrescriptionParam === 'true';
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Memoize API parameters object
  const apiParams: FetchProductsParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      search: search || undefined,
      category,
      inStock,
      requiresPrescription,
      sortBy: sortByParam,
      sortOrder: sortOrderParam,
    }),
    [page, search, category, inStock, requiresPrescription, sortByParam, sortOrderParam]
  );

  // Fetch live products via useProducts hook
  const { products: serverProducts, meta, isLoading, error, refetch } = useProducts(apiParams);

  // Optimistic UI state
  const [localProducts, setLocalProducts] = useState<SerializedProduct[]>([]);

  // Sync server products into local state whenever serverProducts updates
  useEffect(() => {
    setLocalProducts(serverProducts);
  }, [serverProducts]);

  // Modal Visibility States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<SerializedProduct | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<SerializedProduct | null>(null);

  // Submitting flags for mutation feedback
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Dynamically extract unique categories from loaded products list (Memoized)
  const categories = useMemo(() => {
    const set = new Set<string>();
    localProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [localProducts]);

  // Centralized URL parameter update helper
  const updateUrlParams = useCallback(
    (newParams: Record<string, string | undefined>, isNavigation = false) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === '') {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });

      const queryString = params.toString();
      const newPath = `${pathname}${queryString ? `?${queryString}` : ''}`;

      if (isNavigation) {
        router.push(newPath);
      } else {
        router.replace(newPath, { scroll: false });
      }
    },
    [searchParams, pathname, router]
  );

  // Callbacks for controls
  const handleSearchChange = useCallback(
    (newSearch: string) => {
      updateUrlParams({ search: newSearch || undefined, page: undefined });
    },
    [updateUrlParams]
  );

  const handleCategoryChange = useCallback(
    (newCategory?: string) => {
      updateUrlParams({ category: newCategory, page: undefined });
    },
    [updateUrlParams]
  );

  const handleInStockChange = useCallback(
    (newInStock?: boolean) => {
      updateUrlParams({ inStock: newInStock === undefined ? undefined : String(newInStock), page: undefined });
    },
    [updateUrlParams]
  );

  const handlePrescriptionChange = useCallback(
    (newRx?: boolean) => {
      updateUrlParams({ requiresPrescription: newRx === undefined ? undefined : String(newRx), page: undefined });
    },
    [updateUrlParams]
  );

  const handleSortChange = useCallback(
    (newSortBy: 'createdAt' | 'price' | 'name', newSortOrder: 'asc' | 'desc') => {
      updateUrlParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: undefined });
    },
    [updateUrlParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateUrlParams({ page: newPage > 1 ? String(newPage) : undefined }, true);
    },
    [updateUrlParams]
  );

  const handleClearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Centralized Optimistic Mutation Handlers
  const handleAddProduct = async (formData: ProductFormData) => {
    setIsSubmittingAdd(true);
    const tempId = `temp-${Date.now()}`;
    const tempSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const optimisticProduct: SerializedProduct = {
      id: tempId,
      name: formData.name,
      slug: tempSlug,
      category: formData.category,
      price: String(formData.price),
      description: formData.description || null,
      imageUrl: formData.imageUrl || null,
      inStock: formData.inStock,
      requiresPrescription: formData.requiresPrescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 1. Optimistically update local UI state immediately
    setLocalProducts((prev) => [optimisticProduct, ...prev]);
    setIsAddModalOpen(false);

    try {
      // 2. Call API
      const res = await createProduct(formData);
      if (res.success) {
        toast.success(`Product "${formData.name}" created successfully`);
        await refetch();
      } else {
        throw new Error(res.error?.message || 'Failed to create product');
      }
    } catch (err: unknown) {
      // 3. Rollback on failure
      setLocalProducts(serverProducts);
      const msg = err instanceof Error ? err.message : 'Failed to create product';
      toast.error(msg);
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleUpdateProduct = async (id: string, formData: ProductFormData) => {
    setIsSubmittingEdit(true);

    const previousProducts = [...localProducts];

    // 1. Optimistically update local UI state
    setLocalProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: formData.name,
              category: formData.category,
              price: String(formData.price),
              description: formData.description || null,
              imageUrl: formData.imageUrl || null,
              inStock: formData.inStock,
              requiresPrescription: formData.requiresPrescription,
              updatedAt: new Date(),
            }
          : p
      )
    );
    setEditingProduct(null);

    try {
      // 2. Call API
      const res = await updateProduct(id, formData);
      if (res.success) {
        toast.success(`Product "${formData.name}" updated successfully`);
        await refetch();
      } else {
        throw new Error(res.error?.message || 'Failed to update product');
      }
    } catch (err: unknown) {
      // 3. Rollback on failure
      setLocalProducts(previousProducts);
      const msg = err instanceof Error ? err.message : 'Failed to update product';
      toast.error(msg);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setIsSubmittingDelete(true);
    const targetProduct = localProducts.find((p) => p.id === id);
    const previousProducts = [...localProducts];

    // 1. Optimistically remove item from UI state
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingProduct(null);

    try {
      // 2. Call API
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success(`Product "${targetProduct?.name || 'Item'}" deleted successfully`);
        await refetch();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err: unknown) {
      // 3. Rollback on failure
      setLocalProducts(previousProducts);
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      toast.error(msg);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const hasActiveFilters = Boolean(
    search || category || inStock !== undefined || requiresPrescription !== undefined || sortByParam !== 'createdAt' || sortOrderParam !== 'desc'
  );

  const totalCount = meta?.totalItems ?? localProducts.length;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="w-full space-y-6">
      {/* Catalog Header Bar: Search, Filters, Sort & Add Product CTA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex-1 max-w-md">
            <ProductSearch
              value={search}
              onChange={handleSearchChange}
              onImmediateSearch={handleSearchChange}
            />
          </div>

          {/* Filters, Sort & Add Product Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-3 flex-wrap">
            <ProductFilters
              categories={categories}
              selectedCategory={category}
              selectedInStock={inStock}
              selectedPrescription={requiresPrescription}
              onCategoryChange={handleCategoryChange}
              onInStockChange={handleInStockChange}
              onPrescriptionChange={handlePrescriptionChange}
              onClearAll={handleClearAll}
              hasActiveFilters={hasActiveFilters}
            />

            <SortDropdown
              sortBy={sortByParam}
              sortOrder={sortOrderParam}
              onSortChange={handleSortChange}
            />

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
              onClick={() => setIsAddModalOpen(true)}
              className="shrink-0"
              aria-label="Add new product to catalog"
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Screen Reader Announcement Live Region */}
      <div className="sr-only" aria-live="polite">
        {isLoading
          ? 'Loading products catalog...'
          : `Loaded ${localProducts.length} products.`}
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <>
          <ProductsSummary
            totalItems={DEFAULT_PAGE_SIZE}
            pageSize={DEFAULT_PAGE_SIZE}
            page={page}
            search={search}
            category={category}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </>
      )}

      {/* Error State with Retry Button */}
      {!isLoading && error && (
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-500" aria-hidden="true" />}
          title="Unable to load products"
          description={error}
          onRetry={refetch}
        />
      )}

      {/* Empty Filter Results / Catalog State */}
      {!isLoading && !error && localProducts.length === 0 && (
        <EmptyState
          icon={<PackageOpen className="w-12 h-12 text-slate-400" aria-hidden="true" />}
          title={hasActiveFilters ? 'No products match your search' : 'No products found'}
          description={
            hasActiveFilters
              ? 'Try changing your search keywords or active filter parameters.'
              : 'There are currently no healthcare products available in the catalog.'
          }
          actionText={hasActiveFilters ? 'Reset Filters' : 'Add First Product'}
          onAction={hasActiveFilters ? handleClearAll : () => setIsAddModalOpen(true)}
        />
      )}

      {/* Success State: Live Catalog Grid & Pagination */}
      {!isLoading && !error && localProducts.length > 0 && (
        <>
          <ProductsSummary
            totalItems={totalCount}
            pageSize={DEFAULT_PAGE_SIZE}
            page={page}
            currentItemsCount={localProducts.length}
            search={search}
            category={category}
          />

          <ProductGrid
            products={localProducts}
            onViewDetails={(p) => setDetailsProduct(p)}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={(p) => setDeletingProduct(p)}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* ─── CRUD MODALS ─── */}

      {/* 1. Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        isSubmitting={isSubmittingAdd}
      />

      {/* 2. Edit Product Modal */}
      <EditProductModal
        isOpen={Boolean(editingProduct)}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdate={handleUpdateProduct}
        isSubmitting={isSubmittingEdit}
      />

      {/* 3. Delete Confirmation Dialog */}
      <DeleteProductDialog
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirmDelete={handleDeleteProduct}
        isDeleting={isSubmittingDelete}
      />

      {/* 4. Product Details Modal */}
      <ProductDetailsModal
        isOpen={Boolean(detailsProduct)}
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onEdit={(p) => {
          setDetailsProduct(null);
          setEditingProduct(p);
        }}
      />
    </div>
  );
};
