'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/components/providers/toast-provider';
import { getStockStatus } from '@/lib/utils/inventory';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { getAvailableStock } from '@/components/providers/cart-provider';
import { ProductsSummary } from './ProductsSummary';
import { ProductGrid } from './ProductGrid';
import { ProductSearch } from './ProductSearch';
import { ProductFilters, StockStatusFilter } from './ProductFilters';
import { SortDropdown, SortKey } from './SortDropdown';
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
  const { data: session } = useSession();

  // Derive admin status from session role
  const isAdmin = session?.user?.role === 'ADMIN';

  // Extract current query parameters from URL
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || undefined;
  const stockStatusParam = (searchParams.get('stockStatus') as StockStatusFilter) || 'ALL';
  const featuredParam = searchParams.get('featured') === 'true';
  const onSaleParam = searchParams.get('onSale') === 'true';
  const requiresPrescriptionParam = searchParams.get('requiresPrescription');
  const sortByParam = (searchParams.get('sortBy') as SortKey) || 'createdAt';
  const sortOrderParam = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const requiresPrescription = requiresPrescriptionParam === null ? undefined : requiresPrescriptionParam === 'true';
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Memoize API parameters object to fetch products catalog list (pageSize=100 for client pipeline)
  const apiParams: FetchProductsParams = useMemo(
    () => ({
      page: 1,
      pageSize: 100,
    }),
    []
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

  const handleStockStatusChange = useCallback(
    (newStatus: StockStatusFilter) => {
      updateUrlParams({ stockStatus: newStatus === 'ALL' ? undefined : newStatus, page: undefined });
    },
    [updateUrlParams]
  );

  const handleFeaturedChange = useCallback(
    (newFeatured?: boolean) => {
      updateUrlParams({ featured: newFeatured ? 'true' : undefined, page: undefined });
    },
    [updateUrlParams]
  );

  const handleOnSaleChange = useCallback(
    (newOnSale?: boolean) => {
      updateUrlParams({ onSale: newOnSale ? 'true' : undefined, page: undefined });
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
    (newSortBy: SortKey, newSortOrder: 'asc' | 'desc') => {
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

  // Phase 10C Unified Filter & Non-Mutating Sort Pipeline (useMemo)
  const processedProducts = useMemo(() => {
    let result = [...localProducts];

    // 1. Search Filter (Case-insensitive match on name, category, or description)
    if (searchParam.trim()) {
      const q = searchParam.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (categoryParam) {
      result = result.filter((p) => p.category.toLowerCase() === categoryParam.toLowerCase());
    }

    // 3. Inventory Stock Status Filter (using getStockStatus & getAvailableStock)
    if (stockStatusParam !== 'ALL') {
      result = result.filter((p) => {
        const availableStock = getAvailableStock(p);
        const threshold = p.lowStockThreshold ?? 5;
        const status = getStockStatus(availableStock, threshold);
        return status === stockStatusParam;
      });
    }

    // 4. Featured Filter
    if (featuredParam) {
      result = result.filter((p) => p.isFeatured === true);
    }

    // 5. On Sale Filter (discount > 0)
    if (onSaleParam) {
      result = result.filter((p) => {
        const disc = typeof p.discount === 'string' ? parseFloat(p.discount) : p.discount;
        return disc !== undefined && disc > 0;
      });
    }

    // 6. Prescription Requirement Filter
    if (requiresPrescription !== undefined) {
      result = result.filter((p) => p.requiresPrescription === requiresPrescription);
    }

    // 7. Non-Mutating Sorting Pipeline
    result.sort((a, b) => {
      const priceA = calculateDiscountedPrice(a.price, a.discount ?? 0).discountedPrice;
      const priceB = calculateDiscountedPrice(b.price, b.discount ?? 0).discountedPrice;

      const discA = typeof a.discount === 'string' ? parseFloat(a.discount) : (a.discount ?? 0);
      const discB = typeof b.discount === 'string' ? parseFloat(b.discount) : (b.discount ?? 0);

      switch (sortByParam) {
        case 'featured':
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        case 'createdAt':
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return sortOrderParam === 'asc' ? timeA - timeB : timeB - timeA;
        case 'price':
          return sortOrderParam === 'asc' ? priceA - priceB : priceB - priceA;
        case 'discount':
          return discB - discA;
        case 'name':
          return sortOrderParam === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [
    localProducts,
    searchParam,
    categoryParam,
    stockStatusParam,
    featuredParam,
    onSaleParam,
    requiresPrescription,
    sortByParam,
    sortOrderParam,
  ]);

  // Client-side pagination calculations
  const totalCount = processedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    return processedProducts.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [processedProducts, currentPage]);

  // Calculate active filter count for mobile badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchParam) count++;
    if (categoryParam) count++;
    if (stockStatusParam !== 'ALL') count++;
    if (featuredParam) count++;
    if (onSaleParam) count++;
    if (requiresPrescription !== undefined) count++;
    return count;
  }, [searchParam, categoryParam, stockStatusParam, featuredParam, onSaleParam, requiresPrescription]);

  const hasActiveFilters = activeFilterCount > 0 || sortByParam !== 'createdAt' || sortOrderParam !== 'desc';

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
      imagePublicId: formData.imagePublicId || null,
      inStock: formData.inStock,
      requiresPrescription: formData.requiresPrescription,
      stockQuantity: formData.stockQuantity ?? (formData.inStock ? 10 : 0),
      lowStockThreshold: formData.lowStockThreshold ?? 5,
      discount: formData.discount !== undefined ? String(formData.discount) : '0',
      isFeatured: formData.isFeatured ?? false,
      isActive: formData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLocalProducts((prev) => [optimisticProduct, ...prev]);
    setIsAddModalOpen(false);

    try {
      const res = await createProduct(formData);
      if (res.success) {
        toast.success(`Product "${formData.name}" created successfully`);
        await refetch();
      } else {
        throw new Error(res.error?.message || 'Failed to create product');
      }
    } catch (err: unknown) {
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
              imagePublicId: formData.imagePublicId !== undefined ? formData.imagePublicId : p.imagePublicId,
              inStock: formData.inStock,
              requiresPrescription: formData.requiresPrescription,
              stockQuantity: formData.stockQuantity ?? p.stockQuantity,
              lowStockThreshold: formData.lowStockThreshold ?? p.lowStockThreshold,
              discount: formData.discount !== undefined ? String(formData.discount) : p.discount,
              isFeatured: formData.isFeatured ?? p.isFeatured,
              isActive: formData.isActive ?? p.isActive,
              updatedAt: new Date(),
            }
          : p
      )
    );
    setEditingProduct(null);

    try {
      const res = await updateProduct(id, formData);
      if (res.success) {
        toast.success(`Product "${formData.name}" updated successfully`);
        await refetch();
      } else {
        throw new Error(res.error?.message || 'Failed to update product');
      }
    } catch (err: unknown) {
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

    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingProduct(null);

    try {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success(`Product "${targetProduct?.name || 'Item'}" deleted successfully`);
        await refetch();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err: unknown) {
      setLocalProducts(previousProducts);
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      toast.error(msg);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Catalog Header Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex-1 max-w-md">
            <ProductSearch
              value={searchParam}
              onChange={handleSearchChange}
              onImmediateSearch={handleSearchChange}
            />
          </div>

          {/* Filters, Sort & Add Product CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-3 flex-wrap">
            <ProductFilters
              categories={categories}
              selectedCategory={categoryParam}
              selectedStockStatus={stockStatusParam}
              selectedFeatured={featuredParam}
              selectedOnSale={onSaleParam}
              selectedPrescription={requiresPrescription}
              onCategoryChange={handleCategoryChange}
              onStockStatusChange={handleStockStatusChange}
              onFeaturedChange={handleFeaturedChange}
              onOnSaleChange={handleOnSaleChange}
              onPrescriptionChange={handlePrescriptionChange}
              onClearAll={handleClearAll}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
            />

            <SortDropdown
              sortBy={sortByParam}
              sortOrder={sortOrderParam}
              onSortChange={handleSortChange}
            />

            {/* Add Product button — ADMIN only */}
            {isAdmin && (
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
            )}
          </div>
        </div>
      </div>

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        {isLoading
          ? 'Loading products catalog...'
          : `Showing ${paginatedProducts.length} of ${totalCount} products.`}
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <>
          <ProductsSummary
            totalItems={DEFAULT_PAGE_SIZE}
            pageSize={DEFAULT_PAGE_SIZE}
            page={currentPage}
            search={searchParam}
            category={categoryParam}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-red-500" aria-hidden="true" />}
          title="Unable to load products"
          description={error}
          onRetry={refetch}
        />
      )}

      {/* Empty Filter Results / Catalog State */}
      {!isLoading && !error && processedProducts.length === 0 && (
        <EmptyState
          icon={<PackageOpen className="w-12 h-12 text-slate-400" aria-hidden="true" />}
          title={hasActiveFilters ? 'No products match your active filters' : 'No products found'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search keywords, category, or inventory filters.'
              : 'There are currently no healthcare products available in the catalog.'
          }
          actionText={hasActiveFilters ? 'Clear All Filters' : isAdmin ? 'Add First Product' : undefined}
          onAction={hasActiveFilters ? handleClearAll : isAdmin ? () => setIsAddModalOpen(true) : undefined}
        />
      )}

      {/* Live Catalog Grid & Pagination */}
      {!isLoading && !error && processedProducts.length > 0 && (
        <>
          <ProductsSummary
            totalItems={totalCount}
            pageSize={DEFAULT_PAGE_SIZE}
            page={currentPage}
            currentItemsCount={paginatedProducts.length}
            search={searchParam}
            category={categoryParam}
          />

          <ProductGrid
            products={paginatedProducts}
            onViewDetails={(p) => setDetailsProduct(p)}
            onEdit={isAdmin ? (p) => setEditingProduct(p) : undefined}
            onDelete={isAdmin ? (p) => setDeletingProduct(p) : undefined}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* CRUD MODALS (ADMIN only) */}
      {isAdmin && (
        <>
          <AddProductModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddProduct}
            isSubmitting={isSubmittingAdd}
          />

          <EditProductModal
            isOpen={Boolean(editingProduct)}
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onUpdate={handleUpdateProduct}
            isSubmitting={isSubmittingEdit}
          />

          <DeleteProductDialog
            isOpen={Boolean(deletingProduct)}
            product={deletingProduct}
            onClose={() => setDeletingProduct(null)}
            onConfirmDelete={handleDeleteProduct}
            isDeleting={isSubmittingDelete}
          />
        </>
      )}

      {/* Product Details Modal — visible to all */}
      <ProductDetailsModal
        isOpen={Boolean(detailsProduct)}
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onEdit={isAdmin ? (p) => {
          setDetailsProduct(null);
          setEditingProduct(p);
        } : undefined}
      />
    </div>
  );
};
