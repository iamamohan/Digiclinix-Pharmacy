import { Product } from '@prisma/client';

export type SerializedProduct = Omit<Product, 'price' | 'discount'> & {
  price: string;
  discount: string;
};

export interface ProductFormData {
  name: string;
  category: string;
  price: number | string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string;
  inStock: boolean;
  requiresPrescription: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  discount?: number | string;
  isFeatured?: boolean;
  isActive?: boolean;

  // Phase 10E Fields
  uses?: string;
  warnings?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}
