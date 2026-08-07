import { Product } from '@prisma/client';

export type SerializedProduct = Omit<Product, 'price'> & {
  price: string;
};

export interface ProductFormData {
  name: string;
  category: string;
  price: number | string;
  description?: string;
  imageUrl?: string;
  inStock: boolean;
  requiresPrescription: boolean;
}
