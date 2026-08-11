import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from '@/lib/constants';

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
  search: z
    .string()
    .trim()
    .transform((val) => (val.length === 0 ? undefined : val))
    .optional(),
  category: z.string().trim().optional(),
  inStock: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }, z.boolean().optional()),
  requiresPrescription: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }, z.boolean().optional()),
  isFeatured: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }, z.boolean().optional()),
  isActive: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }, z.boolean().optional()),
  sortBy: z.enum(['createdAt', 'price', 'name']).default(DEFAULT_SORT_BY),
  sortOrder: z.enum(['asc', 'desc']).default(DEFAULT_SORT_ORDER),
});

export const productIdParamSchema = z
  .string()
  .min(1, 'Identifier is required')
  .trim();

export const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercased alphanumeric with hyphens')
    .optional(),
  category: z.string().min(1, 'Category is required').trim(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  imagePublicId: z.string().trim().optional(),
  inStock: z.boolean().default(true),
  requiresPrescription: z.boolean().default(false),

  // Phase 10A Inventory Fields
  stockQuantity: z.coerce
    .number()
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative')
    .default(0),
  lowStockThreshold: z.coerce
    .number()
    .int('Low stock threshold must be an integer')
    .min(0, 'Low stock threshold cannot be negative')
    .default(5),
  discount: z.coerce
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type GetProductsQueryInput = z.infer<typeof getProductsQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
