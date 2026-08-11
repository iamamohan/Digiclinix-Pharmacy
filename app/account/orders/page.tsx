'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowRight, Eye, Calendar } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

interface OrderItemData {
  id: string;
  productName: string;
  quantity: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: string | number;
  createdAt: string;
  items: OrderItemData[];
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserOrders() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(data.data);
        }
      } catch {
        // Ignore network errors
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserOrders();
  }, []);

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#0B1220] min-h-screen transition-colors duration-200">
      <Container className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-manrope">
              My Order History
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and track all your past healthcare orders placed with Digiclinix Pharmacy.
            </p>
          </div>

          <Link href="/products">
            <Button variant="outline" size="sm">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Orders List / Empty State */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-semibold text-sm animate-pulse">
            Loading your order history...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" aria-hidden="true" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                You haven&apos;t placed any orders yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore our healthcare catalog and get prescription drugs and wellness items delivered.
              </p>
            </div>
            <Link href="/products">
              <Button variant="primary" size="md" className="bg-purple-600 hover:bg-purple-700 text-white">
                Browse Products Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:text-red-400'
                            : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        ● {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{itemCount} item(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-500 block">Total</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white font-manrope">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    <Link href={`/orders/${order.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="text-xs font-semibold"
                      >
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
