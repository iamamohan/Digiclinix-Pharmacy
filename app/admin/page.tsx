import React from 'react';
import Link from 'next/link';
import { orderService } from '@/services/order.service';
import { formatCurrency } from '@/lib/utils/format';
import { Package, AlertTriangle, ShoppingBag, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await orderService.getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Metrics Grid (8 Stat Cards) */}
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 mb-4">
          Store & Order Metrics Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Products</span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Package className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-manrope mt-2">
              {stats.totalProducts}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stats.activeProducts} active in catalog</p>
          </div>

          {/* Low Stock Products */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Low Stock Alerts</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-manrope mt-2">
              {stats.lowStockProducts}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stats.outOfStockProducts} out of stock</p>
          </div>

          {/* Total Orders */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Orders</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-manrope mt-2">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stats.deliveredOrders} delivered</p>
          </div>

          {/* Pending Orders */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Processing</span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-manrope mt-2">
              {stats.pendingOrders}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stats.processingOrders} in processing</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/admin/orders"
          className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-purple-600" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Orders Dashboard</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/products"
          className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-purple-600" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Product Management</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/inventory"
          className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Inventory Alerts</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/admin/customers"
          className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-600" aria-hidden="true" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Customer Directory</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-manrope">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Latest orders placed across Digiclinix Pharmacy
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            View All Orders →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-medium">
            No orders have been placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Order Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {order.orderNumber}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {order.shippingName}
                      <span className="block text-[11px] font-normal text-slate-500">
                        {order.user?.email}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-extrabold text-slate-900 dark:text-white font-manrope">
                      {formatCurrency(Number(order.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
