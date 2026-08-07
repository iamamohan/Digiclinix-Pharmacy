import { SerializedProduct, ProductFormData } from '@/types/product';
import { PaginationMeta } from '@/lib/response';

export interface FetchProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  inStock?: boolean;
  requiresPrescription?: boolean;
  sortBy?: 'createdAt' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsApiResponse {
  success: boolean;
  data: SerializedProduct[];
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface SingleProductApiResponse {
  success: boolean;
  data?: SerializedProduct;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Generic API fetch helper for fetching paginated/filtered products list from GET /api/products
 */
export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductsApiResponse> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', params.page.toString());
  if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
  if (params.search) queryParams.set('search', params.search);
  if (params.category) queryParams.set('category', params.category);
  if (params.inStock !== undefined) queryParams.set('inStock', params.inStock.toString());
  if (params.requiresPrescription !== undefined) queryParams.set('requiresPrescription', params.requiresPrescription.toString());
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to fetch products (${response.status})`);
  }

  return response.json();
}

/**
 * Fetch a single product by UUID or slug from GET /api/products/[id]
 */
export async function fetchProductByIdOrSlug(idOrSlug: string): Promise<SingleProductApiResponse> {
  const response = await fetch(`/api/products/${encodeURIComponent(idOrSlug)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to fetch product (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new product via POST /api/products
 */
export async function createProduct(data: ProductFormData): Promise<SingleProductApiResponse> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
    }),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData?.error?.message || `Failed to create product (${response.status})`);
  }

  return responseData;
}

/**
 * Update an existing product via PUT /api/products/[id]
 */
export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<SingleProductApiResponse> {
  const payload = {
    ...data,
    ...(data.price !== undefined ? { price: typeof data.price === 'string' ? parseFloat(data.price) : data.price } : {}),
  };

  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData?.error?.message || `Failed to update product (${response.status})`);
  }

  return responseData;
}

/**
 * Delete a product via DELETE /api/products/[id]
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData?.error?.message || `Failed to delete product (${response.status})`);
  }

  return responseData;
}
