'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SerializedProduct } from '@/types/product';
import { useToast } from '@/components/providers/toast-provider';

export interface CartItem {
  product: SerializedProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: SerializedProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getAvailableStock: (product: SerializedProduct) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'digiclinix_cart_items_v1';

/**
 * Authoritative available stock calculation helper.
 * Uses product.stockQuantity when defined, falling back to legacy product.inStock.
 */
export function getAvailableStock(product: SerializedProduct): number {
  if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
    return Math.max(0, product.stockQuantity);
  }
  return product.inStock ? 10 : 0;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  // Safe client-side hydration from localStorage after mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to parse cart items from localStorage:', error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Save cart changes to localStorage (only after component has mounted)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items, mounted]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addItem = useCallback(
    (product: SerializedProduct, quantityToAdd = 1) => {
      if (quantityToAdd <= 0) return;

      const availableStock = getAvailableStock(product);

      if (availableStock <= 0) {
        toast.error(`"${product.name}" is currently out of stock.`);
        return;
      }

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
        const existingQty = existingIndex > -1 ? prevItems[existingIndex].quantity : 0;

        if (existingQty >= availableStock) {
          toast.error(`Maximum available stock (${availableStock} units) of "${product.name}" is already in your cart.`);
          return prevItems;
        }

        const maxAdditional = availableStock - existingQty;
        const actualToAdd = Math.min(quantityToAdd, maxAdditional);

        if (actualToAdd < quantityToAdd) {
          toast.warning(`Only ${actualToAdd} additional unit(s) of "${product.name}" could be added (${availableStock} max stock).`);
        }

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + actualToAdd,
          };
          return updated;
        }

        return [...prevItems, { product, quantity: actualToAdd }];
      });
    },
    [toast]
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
        return;
      }

      setItems((prevItems) => {
        const targetIndex = prevItems.findIndex((item) => item.product.id === productId);
        if (targetIndex === -1) return prevItems;

        const targetProduct = prevItems[targetIndex].product;
        const availableStock = getAvailableStock(targetProduct);

        if (quantity > availableStock) {
          toast.error(`Cannot add more. Only ${availableStock} units of "${targetProduct.name}" are available in stock.`);
          const updated = [...prevItems];
          updated[targetIndex] = { ...updated[targetIndex], quantity: availableStock };
          return updated;
        }

        const updated = [...prevItems];
        updated[targetIndex] = { ...updated[targetIndex], quantity };
        return updated;
      });
    },
    [toast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const priceNum =
          typeof item.product.price === 'string'
            ? parseFloat(item.product.price)
            : Number(item.product.price) || 0;
        return sum + priceNum * item.quantity;
      }, 0),
    [items]
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    getAvailableStock,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
