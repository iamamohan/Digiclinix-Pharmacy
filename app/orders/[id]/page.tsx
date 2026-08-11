'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, ShoppingBag, Truck, Calendar, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

interface OrderItemData {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: string | number;
  discount: string | number;
  totalPrice: string | number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string | number;
  discount: string | number;
  total: string | number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  createdAt: string;
  items: OrderItemData[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.data);
        } else {
          setError(data.error?.message || 'Failed to load order details');
        }
      } catch {
        setError('Network error loading order details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="py-16 bg-slate-50 dark:bg-[#0B1220]">
        <Container className="max-w-xl text-center font-semibold text-slate-500 animate-pulse">
          Loading order confirmation details...
        </Container>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-16 bg-slate-50 dark:bg-[#0B1220]">
        <Container className="max-w-md text-center space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-soft">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-manrope">
              Order Not Found
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">{error || 'Order does not exist.'}</p>
            <div className="pt-4">
              <Link href="/products">
                <Button variant="primary" size="md" className="w-full">
                  Return to Products Catalog
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#0B1220] min-h-screen transition-colors duration-200">
      <Container className="max-w-3xl space-y-6">
        {/* Success Header Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-manrope">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Order placed successfully. Payment will be handled in a future step.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
            <span>Order Number:</span>
            <span>{order.orderNumber}</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Order Date</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Order Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 uppercase">
                ● {order.status}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Payment Status</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Pending Integration (Phase 10E)
              </span>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Shipping Address
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{order.shippingName}</p>
              <p className="text-slate-600 dark:text-slate-300">{order.shippingAddress}</p>
              <p className="text-slate-600 dark:text-slate-300">
                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
              </p>
              <p className="text-slate-500 font-medium">Phone: {order.shippingPhone}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Ordered Products ({order.items.length})
            </h3>
            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                    <p className="text-slate-500 text-[11px]">
                      {formatCurrency(item.unitPrice)} x {item.quantity} units
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white font-manrope">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-purple-600 dark:text-purple-400 font-semibold">
                <span>Discount Savings</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800 font-manrope">
              <span>Total Paid/Due</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link href="/account/orders">
            <Button variant="outline" size="md">
              View Order History
            </Button>
          </Link>

          <Link href="/products">
            <Button variant="primary" size="md" className="bg-purple-600 hover:bg-purple-700 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
