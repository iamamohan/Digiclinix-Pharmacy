'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/components/providers/cart-provider';
import { CartHeader } from './CartHeader';
import { CartItem } from './CartItem';
import { EmptyCart } from './EmptyCart';
import { CartSummary } from './CartSummary';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Hydration safety check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus management & body scroll lock
  useEffect(() => {
    if (isCartOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus the drawer panel for keyboard navigation
      setTimeout(() => {
        drawerRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Handle ESC key press to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-over panel container — no pl-10 offset on mobile to prevent 40px right overflow */}
      <div className="fixed inset-y-0 right-0 z-[100000] w-full max-w-full sm:max-w-md flex">
        <div
          ref={drawerRef}
          tabIndex={-1}
          className="w-full bg-white dark:bg-[#0B1220] shadow-2xl flex flex-col focus:outline-none transition-transform duration-300 animate-in slide-in-from-right"
        >
          {/* Header */}
          <CartHeader totalItems={totalItems} onClose={closeCart} />

          {/* Body: Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {items.length === 0 ? (
              <EmptyCart onClose={closeCart} />
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <CartSummary
              totalPrice={totalPrice}
              totalItems={totalItems}
              onClearCart={clearCart}
              onClose={closeCart}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
