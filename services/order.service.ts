import { prisma } from '@/lib/prisma';
import { CreateOrderInput } from '@/lib/validations/order.schema';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { OrderStatus, Prisma } from '@prisma/client';

export class OrderServiceError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST') {
    super(message);
    this.name = 'OrderServiceError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Generates a collision-safe human-readable order number (DCP-YYYYMMDD-XXXXX)
 */
function generateOrderNumberString(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
  return `DCP-${dateStr}-${randomSuffix}`;
}

export const orderService = {
  /**
   * Creates a new order inside a single atomic Prisma transaction.
   * Performs server-authoritative pricing, stock deduction, and inStock synchronization.
   */
  async createOrder(userId: string, input: CreateOrderInput) {
    // 1. User-scoped Idempotency Check
    if (input.idempotencyKey) {
      const existingOrder = await prisma.order.findUnique({
        where: {
          userId_idempotencyKey: {
            userId,
            idempotencyKey: input.idempotencyKey,
          },
        },
        include: {
          items: true,
        },
      });

      if (existingOrder) {
        return existingOrder;
      }
    }

    // 2. Normalize cart items (Aggregate quantities for duplicate product IDs)
    const itemMap = new Map<string, number>();
    for (const item of input.items) {
      const currentQty = itemMap.get(item.productId) || 0;
      itemMap.set(item.productId, currentQty + item.quantity);
    }

    const normalizedItems = Array.from(itemMap.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    if (normalizedItems.length === 0) {
      throw new OrderServiceError('Cart cannot be empty', 400, 'EMPTY_CART');
    }

    // 3. Fetch all requested products from PostgreSQL
    const productIds = normalizedItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 4. Verify Product Existence, Active Status, Prescription Rule, and Stock
    const processedItems: {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: Prisma.Decimal;
      discount: Prisma.Decimal;
      totalPrice: Prisma.Decimal;
    }[] = [];

    let totalSubtotal = 0;
    let totalDiscount = 0;
    let totalFinal = 0;

    for (const requestedItem of normalizedItems) {
      const product = productMap.get(requestedItem.productId);

      if (!product) {
        throw new OrderServiceError(
          `Product with ID "${requestedItem.productId}" was not found.`,
          404,
          'PRODUCT_NOT_FOUND'
        );
      }

      if (!product.isActive) {
        throw new OrderServiceError(
          `Product "${product.name}" is not currently available for purchase.`,
          400,
          'PRODUCT_INACTIVE'
        );
      }

      if (product.requiresPrescription) {
        throw new OrderServiceError(
          `Prescription medication ("${product.name}") requires pharmacist prescription verification, which will be supported in a future phase.`,
          400,
          'PRESCRIPTION_REQUIRED'
        );
      }

      if (product.stockQuantity < requestedItem.quantity) {
        throw new OrderServiceError(
          `Insufficient stock for "${product.name}". Requested: ${requestedItem.quantity}, Available: ${product.stockQuantity}.`,
          409,
          'INSUFFICIENT_STOCK'
        );
      }

      // 5. Server-Authoritative Price & Discount Calculation
      const basePriceNum = Number(product.price);
      const discountPercentNum = Number(product.discount);
      const calc = calculateDiscountedPrice(basePriceNum, discountPercentNum);

      const unitPrice = calc.discountedPrice;
      const unitDiscountSavings = calc.savingsAmount;
      const itemSubtotal = basePriceNum * requestedItem.quantity;
      const itemDiscountTotal = unitDiscountSavings * requestedItem.quantity;
      const itemTotalPrice = unitPrice * requestedItem.quantity;

      totalSubtotal += itemSubtotal;
      totalDiscount += itemDiscountTotal;
      totalFinal += itemTotalPrice;

      processedItems.push({
        productId: product.id,
        productName: product.name,
        quantity: requestedItem.quantity,
        unitPrice: new Prisma.Decimal(unitPrice),
        discount: new Prisma.Decimal(unitDiscountSavings),
        totalPrice: new Prisma.Decimal(itemTotalPrice),
      });
    }

    // Round order totals safely to 2 decimal places
    const finalSubtotalDecimal = new Prisma.Decimal(Math.round(totalSubtotal * 100) / 100);
    const finalDiscountDecimal = new Prisma.Decimal(Math.round(totalDiscount * 100) / 100);
    const finalTotalDecimal = new Prisma.Decimal(Math.round(totalFinal * 100) / 100);

    // 6. Generate orderNumber with retry loop on unique collision
    let orderNumber = generateOrderNumberString();
    let orderCreated = false;
    let createdOrderResult: any = null;

    let attempts = 0;
    while (!orderCreated && attempts < 5) {
      attempts++;
      try {
        // 7. Atomic Transaction: Decrement stock, Sync inStock, Create Order & Items
        createdOrderResult = await prisma.$transaction(
          async (tx) => {
          // A. Atomic Stock Decrement & inStock Sync for each item
          for (const item of normalizedItems) {
            const updateResult = await tx.product.updateMany({
              where: {
                id: item.productId,
                stockQuantity: { gte: item.quantity },
              },
              data: {
                stockQuantity: { decrement: item.quantity },
              },
            });

            if (updateResult.count === 0) {
              const p = productMap.get(item.productId);
              throw new OrderServiceError(
                `Stock changed during order execution for "${p?.name || item.productId}". Please try again.`,
                409,
                'STOCK_CONFLICT'
              );
            }

            // Sync inStock = (new stockQuantity > 0)
            const updatedProduct = await tx.product.findUnique({
              where: { id: item.productId },
              select: { stockQuantity: true },
            });

            const newStock = updatedProduct?.stockQuantity ?? 0;
            await tx.product.update({
              where: { id: item.productId },
              data: {
                inStock: newStock > 0,
              },
            });
          }

          // B. Create Order record
          const newOrder = await tx.order.create({
            data: {
              orderNumber,
              idempotencyKey: input.idempotencyKey || null,
              userId,
              status: 'PENDING',
              subtotal: finalSubtotalDecimal,
              discount: finalDiscountDecimal,
              total: finalTotalDecimal,
              shippingName: input.shippingName,
              shippingPhone: input.shippingPhone,
              shippingAddress: input.shippingAddress,
              shippingCity: input.shippingCity,
              shippingState: input.shippingState,
              shippingPostalCode: input.shippingPostalCode,
              items: {
                create: processedItems.map((item) => ({
                  productId: item.productId,
                  productName: item.productName,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  discount: item.discount,
                  totalPrice: item.totalPrice,
                })),
              },
            },
            include: {
              items: true,
            },
          });

          return newOrder;
        }, { maxWait: 10000, timeout: 30000 });

        orderCreated = true;
      } catch (err: any) {
        if (err.code === 'P2002' && err.meta?.target?.includes('orderNumber')) {
          orderNumber = generateOrderNumberString();
        } else {
          throw err;
        }
      }
    }

    if (!orderCreated) {
      throw new OrderServiceError('Failed to generate a unique order number. Please try placing your order again.', 500, 'ORDER_NUMBER_FAILED');
    }

    return createdOrderResult;
  },

  /**
   * Fetches an order by ID with ownership or Admin authorization verification
   */
  async getOrderById(orderId: string, userId: string, isAdmin: boolean) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                imageUrl: true,
                slug: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new OrderServiceError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new OrderServiceError('You do not have permission to view this order', 403, 'FORBIDDEN');
    }

    return order;
  },

  /**
   * Fetches order history for a specific customer
   */
  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Fetches all orders for Admin management with optional status filter
   */
  async getAllOrders(statusFilter?: OrderStatus) {
    return prisma.order.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Updates order status enforcing strict state machine transitions and atomic stock restoration on cancellation.
   */
  async updateOrderStatus(orderId: string, newStatus: OrderStatus, isAdmin: boolean) {
    if (!isAdmin) {
      throw new OrderServiceError('Admin access required to update order status', 403, 'FORBIDDEN');
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!currentOrder) {
      throw new OrderServiceError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    const currentStatus = currentOrder.status;

    // Enforce strict State Machine transition rules
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    const validNextStates = allowedTransitions[currentStatus] || [];
    if (!validNextStates.includes(newStatus)) {
      throw new OrderServiceError(
        `Invalid status transition from ${currentStatus} to ${newStatus}.`,
        400,
        'INVALID_STATUS_TRANSITION'
      );
    }

    // Handle Order Cancellation with Atomic Stock Restoration
    if (newStatus === 'CANCELLED') {
      return prisma.$transaction(async (tx) => {
        // Concurrency-safe status update: only update if currently PENDING or CONFIRMED
        const updateCount = await tx.order.updateMany({
          where: {
            id: orderId,
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          data: { status: 'CANCELLED' },
        });

        if (updateCount.count === 0) {
          throw new OrderServiceError(
            'Order cannot be cancelled because its status has changed.',
            400,
            'CANCELLATION_FAILED'
          );
        }

        // Restore Product stockQuantity and synchronize inStock
        for (const item of currentOrder.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: { increment: item.quantity },
                inStock: true,
              },
            });
          }
        }

        return tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
      }, { maxWait: 10000, timeout: 30000 });
    }

    // Standard Status Transition (Non-cancellation)
    return prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { items: true },
    });
  },

  /**
   * Fetches real-time metrics for Admin Overview Dashboard (/admin)
   */
  async getAdminDashboardStats() {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stockQuantity: { gt: 0, lte: 5 } } }),
      prisma.product.count({ where: { stockQuantity: 0 } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      recentOrders,
    };
  },

  /**
   * Fetches privacy-safe customer overview metrics (/admin/customers)
   * NEVER exposes password hashes or OAuth tokens.
   */
  async getAdminCustomersList() {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        orders: {
          select: {
            total: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => {
      const ordersCount = u.orders.length;
      const totalSpent = u.orders.reduce((sum, o) => sum + Number(o.total), 0);
      return {
        id: u.id,
        name: u.name || 'Anonymous Customer',
        email: u.email || 'N/A',
        createdAt: u.createdAt,
        ordersCount,
        totalSpent: Math.round(totalSpent * 100) / 100,
      };
    });
  },
};
