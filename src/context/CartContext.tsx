'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: CartItem['selectedVariant']) => void;
  removeItem: (productId: string, selectedVariant?: CartItem['selectedVariant']) => void;
  setQuantity: (productId: string, quantity: number, selectedVariant?: CartItem['selectedVariant']) => void;
  clear: () => void;
  subtotal: number;
  totalSavings: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'imitation-jwellery-cart';
const SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

function getCartKey(productId: string, selectedVariant?: CartItem['selectedVariant']): string {
  if (!selectedVariant) return productId;
  const variantStr = Object.entries(selectedVariant)
    .sort()
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${productId}|${variantStr}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Reconstruct dates
        const itemsWithDates = parsed.map((item: CartItem) => ({
          ...item,
          product: {
            ...item.product,
            createdAt: new Date(item.product.createdAt),
          },
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (
    product: Product,
    quantity: number = 1,
    selectedVariant?: CartItem['selectedVariant']
  ) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      );

      if (existingIndex >= 0) {
        const newItems = [...prev];
        const newQty = Math.min(10, newItems[existingIndex].quantity + quantity);
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQty,
        };
        return newItems;
      }

      return [
        ...prev,
        {
          product,
          quantity: Math.min(10, Math.max(1, quantity)),
          selectedVariant,
        },
      ];
    });
  };

  const removeItem = (productId: string, selectedVariant?: CartItem['selectedVariant']) => {
    setItems(prev =>
      prev.filter(
        item =>
          !(
            item.product.id === productId &&
            JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
          )
      )
    );
  };

  const setQuantity = (
    productId: string,
    quantity: number,
    selectedVariant?: CartItem['selectedVariant']
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId &&
        JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
          ? { ...item, quantity: Math.min(10, Math.max(1, quantity)) }
          : item
      )
    );
  };

  const clear = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountedPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const totalSavings = items.reduce((sum, item) => {
    if (item.product.discountedPrice) {
      const savings = item.product.price - item.product.discountedPrice;
      return sum + savings * item.quantity;
    }
    return sum;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQuantity,
        clear,
        subtotal,
        totalSavings,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

export { SHIPPING_THRESHOLD, SHIPPING_FEE };
