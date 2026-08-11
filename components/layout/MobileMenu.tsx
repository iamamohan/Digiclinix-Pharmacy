'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { X, PhoneCall, Search, ShieldCheck, Home, Package, Info, Phone, User as UserIcon, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils/cn';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; href: string }>;
}

const LINK_ICONS: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5 shrink-0" aria-hidden="true" />,
  Products: <Package className="w-5 h-5 shrink-0" aria-hidden="true" />,
  About: <Info className="w-5 h-5 shrink-0" aria-hidden="true" />,
  Contact: <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />,
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navLinks }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hydration safety check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const displayName = session?.user?.name || session?.user?.email?.split('@')[0] || 'User';

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-[100000] w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header with Logo & Close Button */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <Logo showSubtitle={false} />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              aria-label="Close Mobile Navigation Menu"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Functional Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6" role="search">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines..."
              aria-label="Search medicines in mobile menu"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white font-medium"
            />
          </form>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2.5" aria-label="Mobile Navigation Links">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const icon = LINK_ICONS[link.label] || null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'px-4 py-3 rounded-xl font-bold text-base transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500',
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                      : 'text-slate-900 dark:text-slate-100 hover:bg-purple-50 dark:hover:bg-slate-900 hover:text-purple-600 dark:hover:text-purple-400'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    {icon}
                    <span>{link.label}</span>
                  </div>
                  {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mt-5 flex flex-col gap-3.5">
          {/* User Auth Section in Mobile Menu */}
          {status === 'authenticated' && session?.user ? (
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-slate-900 border border-purple-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {displayName[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{session.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-200/60 dark:border-slate-800">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-slate-700 hover:bg-purple-100 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Account</span>
                </Link>

                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-slate-700 hover:bg-purple-100 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>My Orders</span>
                </Link>
              </div>

              {/* Admin Dashboard link — ADMIN only */}
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold bg-purple-600 text-white shadow-xs hover:bg-purple-700 transition-colors w-full mt-1"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/60 transition-colors mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/login"
                onClick={onClose}
                className="py-2.5 px-4 text-center rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="py-2.5 px-4 text-center rounded-xl font-bold text-xs bg-purple-600 text-white shadow-xs hover:bg-purple-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Theme</span>
            <ThemeToggle />
          </div>

          <a
            href="https://wa.me/919182015238"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 transition-all text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <PhoneCall className="w-4 h-4" />
            <span>WhatsApp Support</span>
          </a>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Licensed Pharmaceutical Provider</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
