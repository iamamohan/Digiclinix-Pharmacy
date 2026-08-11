'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getStockStatusBadgeInfo } from '@/lib/utils/inventory';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { SerializedProduct } from '@/types/product';
import { AlertTriangle, Package, RefreshCw, Eye, EyeOff, Search } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?pageSize=100');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.data);
      }
    } catch {
      // Ignore network errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const qty = p.stockQuantity ?? (p.inStock ? 10 : 0);
    const thresh = p.lowStockThreshold ?? 5;
    const badge = getStockStatusBadgeInfo(qty, thresh);

    const matchesFilter = stockFilter === 'ALL' || badge.status === stockFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-manrope">
            Stock Inventory Monitoring
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time stock quantity levels, threshold alerts, and status monitoring.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchProducts}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Refresh Stock
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or category..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setStockFilter(filterKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  stockFilter === filterKey
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filterKey === 'ALL'
                  ? 'All Stock'
                  : filterKey === 'IN_STOCK'
                  ? 'In Stock'
                  : filterKey === 'LOW_STOCK'
                  ? 'Low Stock'
                  : 'Out of Stock'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Monitoring Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-sm font-semibold animate-pulse">
          Loading inventory status...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">No products match your inventory filter.</div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Stock Quantity</th>
                  <th className="p-3.5">Low Threshold</th>
                  <th className="p-3.5">Inventory Status</th>
                  <th className="p-3.5 text-right">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProducts.map((product) => {
                  const qty = product.stockQuantity ?? (product.inStock ? 10 : 0);
                  const thresh = product.lowStockThreshold ?? 5;
                  const badge = getStockStatusBadgeInfo(qty, thresh);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                        {product.category}
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900 dark:text-white font-manrope">
                        {qty} units
                      </td>
                      <td className="p-3.5 text-slate-500 font-medium">{thresh} units</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${badge.badgeColorClass}`}
                        >
                          ● {badge.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {product.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-semibold">
                            <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
