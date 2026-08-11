import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/authorization';
import { Container } from '@/components/ui/Container';
import { LayoutDashboard, ShoppingBag, Package, AlertTriangle, Users, ArrowLeft } from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: AlertTriangle },
  { label: 'Customers', href: '/admin/customers', icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, response } = await requireAdmin();

  // Server-side Route Enforcement: Unauthenticated -> /login, Normal USER -> /products
  if (response || !user || user.role !== 'ADMIN') {
    redirect('/products');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220] transition-colors duration-200">
      {/* Integrated Admin Header Bar */}
      <div className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <Container className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-purple-600 text-white rounded-md">
                  Admin Portal
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Digiclinix Pharmacy Management
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-manrope mt-0.5">
                Admin Control Center
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back to Store</span>
              </Link>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:custom-scrollbar pt-4 pb-1 mt-2 border-t border-slate-100 dark:border-slate-800/80 -mx-4 px-4 sm:mx-0 sm:px-0">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>

      {/* Main Admin Content Container */}
      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
