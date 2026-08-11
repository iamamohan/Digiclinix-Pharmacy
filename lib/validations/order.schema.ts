import { z } from 'zod';

export const createOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int('Quantity must be an integer').min(1, 'Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  idempotencyKey: z.string().optional(),
  shippingName: z.string().trim().min(2, 'Full name is required (min 2 characters)'),
  shippingPhone: z.string().trim().min(5, 'Phone number is required (min 5 characters)'),
  shippingAddress: z.string().trim().min(5, 'Delivery address is required (min 5 characters)'),
  shippingCity: z.string().trim().min(2, 'City is required'),
  shippingState: z.string().trim().min(2, 'State / Province is required'),
  shippingPostalCode: z.string().trim().min(3, 'Postal code is required'),
  items: z.array(createOrderItemSchema).min(1, 'Cart cannot be empty. Select at least one item.'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const orderStatusEnum = z.enum([
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]);

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
