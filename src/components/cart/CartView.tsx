'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItemRow from './CartItemRow';
import CartSummary from './CartSummary';

export default function CartView() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="mt-6 text-2xl font-serif font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-600">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block bg-gold-600 hover:bg-gold-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="space-y-0">
              {items.map((item, index) => (
                <CartItemRow key={`${item.product.id}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>

      {/* Mobile Sticky Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <Link
          href="/checkout"
          className="block w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
