'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, FetchProductsParams } from '@/lib/api/products';
import { SerializedProduct } from '@/types/product';
import { PaginationMeta } from '@/lib/response';

export function useProducts(params: FetchProductsParams = {}) {
  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const serializedParams = JSON.stringify(params);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const parsedParams: FetchProductsParams = JSON.parse(serializedParams);
      const res = await fetchProducts(parsedParams);
      if (res.success && res.data) {
        setProducts(res.data);
        setMeta(res.meta);
      } else {
        setError(res.error?.message || 'Failed to load products');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while fetching products';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [serializedParams]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    meta,
    isLoading,
    error,
    refetch: loadProducts,
  };
}
