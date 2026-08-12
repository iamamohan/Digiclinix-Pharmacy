export type StockStatus = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';

/**
 * Derives the inventory stock status based on current stock quantity and low-stock threshold.
 * Business logic:
 *   - stockQuantity <= 0                       -> OUT_OF_STOCK
 *   - stockQuantity > 0 && <= lowStockThreshold -> LOW_STOCK
 *   - stockQuantity > lowStockThreshold        -> IN_STOCK
 */
export function getStockStatus(
  stockQuantity: number,
  lowStockThreshold: number = 5
): StockStatus {
  if (stockQuantity <= 0) return 'OUT_OF_STOCK';
  if (stockQuantity <= lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export interface StockStatusBadgeInfo {
  status: StockStatus;
  label: string;
  variant: 'danger' | 'warning' | 'success';
  badgeColorClass: string;
}

/**
 * Returns full admin UI badge metadata for inventory management.
 * Shows OUT_OF_STOCK, LOW_STOCK, or IN_STOCK with count hints.
 */
export function getStockStatusBadgeInfo(
  stockQuantity: number,
  lowStockThreshold: number = 5
): StockStatusBadgeInfo {
  const status = getStockStatus(stockQuantity, lowStockThreshold);

  switch (status) {
    case 'OUT_OF_STOCK':
      return {
        status,
        label: 'Out of Stock',
        variant: 'danger',
        badgeColorClass: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800/60',
      };
    case 'LOW_STOCK':
      return {
        status,
        label: 'Low Stock',
        variant: 'warning',
        badgeColorClass: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60',
      };
    case 'IN_STOCK':
      return {
        status,
        label: 'In Stock',
        variant: 'success',
        badgeColorClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60',
      };
  }
}

/**
 * Customer-facing simplified stock badge.
 * Shows only "In Stock" or "Out of Stock" — never exposes exact quantities,
 * low-stock threshold, or internal inventory details to customers.
 */
export function getCustomerStockStatusBadgeInfo(stockQuantity: number): StockStatusBadgeInfo {
  if (stockQuantity <= 0) {
    return {
      status: 'OUT_OF_STOCK',
      label: 'Out of Stock',
      variant: 'danger',
      badgeColorClass: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800/60',
    };
  }

  return {
    status: 'IN_STOCK',
    label: 'In Stock',
    variant: 'success',
    badgeColorClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60',
  };
}
