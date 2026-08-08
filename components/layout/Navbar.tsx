'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { UserMenu } from '../auth/UserMenu';
import { Container } from '../ui/Container';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/components/providers/cart-provider';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const NavbarSearchInput: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const [query, setQuery] = useState(urlSearch);
  const isMounted = useRef(false);

  // Synchronize internal query state with URL search param on /products
  useEffect(() => {
    if (pathname === '/products') {
      setQuery(urlSearch);
    }
  }, [pathname, urlSearch]);

  // 300ms Debounced search for live catalog updates on /products
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (pathname !== '/products') return;
    if (query === urlSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.replace(`/products?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, pathname, urlSearch, searchParams, router]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (pathname === '/products') {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set('search', trimmed);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.push(`/products?${params.toString()}`);
    } else {
      if (trimmed) {
        router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      } else {
        router.push('/products');
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    if (pathname === '/products') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      params.set('page', '1');
      router.replace(`/products?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-48 lg:w-64" role="search">
      <button
        type="submit"
        className="absolute left-3 top-2.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none"
        aria-label="Submit search"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
      </button>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search medicines..."
        aria-label="Search medicines"
        className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
          aria-label="Clear search text"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </form>
  );
};

const SearchFallback: React.FC = () => (
  <div className="relative w-48 lg:w-64">
    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" aria-hidden="true" />
    <input
      type="text"
      placeholder="Search medicines..."
      aria-label="Search medicines"
      className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
      readOnly
    />
  </div>
);

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-200" role="banner">
      <Container className="flex items-center justify-between h-18">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                  isActive
                    ? 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions Bar */}
        <div className="hidden md:flex items-center gap-2">
          {/* Global Search Input with Suspense boundary */}
          <Suspense fallback={<SearchFallback />}>
            <NavbarSearchInput />
          </Suspense>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative w-10 h-10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0"
            aria-label={`Shopping Cart (${totalItems} items)`}
          >
            <ShoppingBag className="w-5 h-5 shrink-0" aria-hidden="true" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-purple-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-in zoom-in-50">
                {totalItems}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication State: User Menu or Login/Signup buttons */}
          {status === 'authenticated' && session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="flex items-center gap-1.5 ml-1">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <button
            type="button"
            onClick={openCart}
            className="relative w-10 h-10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0"
            aria-label={`Shopping Cart (${totalItems} items)`}
          >
            <ShoppingBag className="w-5 h-5 shrink-0" aria-hidden="true" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-purple-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0"
            aria-label="Open Mobile Navigation Menu"
          >
            <Menu className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={NAV_LINKS}
      />
    </header>
  );
};
