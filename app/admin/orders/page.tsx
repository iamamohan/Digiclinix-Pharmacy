'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils/format';
import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { DialogHeader } from '@/components/ui/DialogHeader';
import { DialogBody } from '@/components/ui/DialogBody';
import { DialogFooter } from '@/components/ui/DialogFooter';
import { Search, ShoppingBag, Eye, RefreshCw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
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
  userId: string;
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
  user?: {
    name?: string | null;
    email?: string | null;
  };
  items: OrderItemData[];
}

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function AdminOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.error?.message || 'Failed to fetch orders');
      }
    } catch {
      toast.error('Network error fetching orders');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.data);
        }
      } else {
        toast.error(data.error?.message || 'Failed to update order status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Enforce strict State Machine Allowed Options
  const getValidNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['PROCESSING', 'CANCELLED'];
      case 'PROCESSING':
        return ['SHIPPED'];
      case 'SHIPPED':
        return ['DELIVERED'];
      default:
        return [];
    }
  };

  // Filtered orders pipeline
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.shippingName.toLowerCase().includes(q) ||
      (o.user?.email && o.user.email.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-manrope">
            Order Management & Status Control
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor customer orders, perform status updates, and manage cancellations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Refresh
        </Button>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number or customer name/email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedStatus(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === opt.value
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table State */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-sm font-semibold animate-pulse">
          Loading order records...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-center text-slate-500 text-xs space-y-2">
          <ShoppingBag className="w-10 h-10 mx-auto text-slate-400" aria-hidden="true" />
          <p className="font-bold text-slate-800 dark:text-slate-200">No orders match your filter criteria.</p>
          <p>Try selecting a different status filter or clearing your search keywords.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Order Number</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-right">Actions / Status Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredOrders.map((order) => {
                  const validNext = getValidNextStatuses(order.status);
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                        {order.orderNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {order.shippingName}
                        </span>
                        <span className="text-[11px] text-slate-500 block">{order.user?.email}</span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : order.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:text-red-400'
                              : order.status === 'SHIPPED'
                              ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400'
                              : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          ● {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white font-manrope">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 text-xs text-slate-600 dark:text-slate-300"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Details
                          </Button>

                          {/* Status Transition Control Dropdown */}
                          {validNext.length > 0 ? (
                            <select
                              disabled={isUpdating}
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleUpdateStatus(order.id, e.target.value as OrderStatus);
                                }
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="">Update Status...</option>
                              {validNext.map((st) => (
                                <option key={st} value={st}>
                                  ➔ {st}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Terminal State</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal isOpen={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} size="lg">
          <DialogHeader
            title={`Order Details: ${selectedOrder.orderNumber}`}
            subtitle={`Placed on ${new Date(selectedOrder.createdAt).toLocaleDateString()}`}
            onClose={() => setSelectedOrder(null)}
          />
          <DialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Status & Delivery Details */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Customer & Shipping
                </span>
                <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.shippingName}</p>
                <p className="text-slate-600 dark:text-slate-300">{selectedOrder.shippingAddress}</p>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingPostalCode}
                </p>
                <p className="text-slate-500 mt-1">Phone: {selectedOrder.shippingPhone}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Order Status & Financials
                </span>
                <p className="font-bold text-purple-600 dark:text-purple-400">Status: {selectedOrder.status}</p>
                <p className="text-slate-600 dark:text-slate-300">Subtotal: {formatCurrency(selectedOrder.subtotal)}</p>
                <p className="text-slate-600 dark:text-slate-300">Discount: -{formatCurrency(selectedOrder.discount)}</p>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                  Total: {formatCurrency(selectedOrder.total)}
                </p>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Ordered Products</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs"
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
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
          </DialogFooter>
        </Modal>
      )}
    </div>
  );
}
