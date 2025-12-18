'use client';

import Link from 'next/link';
import { useCart, SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export default function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { subtotal, totalSavings } = useCart();
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const progressPercent = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft sticky top-24">
      <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Free Shipping Progress */}
      {subtotal < SHIPPING_THRESHOLD && (
        <div className="mb-6 p-4 bg-gold-50 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700">Free shipping progress</span>
            <span className="font-medium text-gold-900">
              {formatINR(remainingForFreeShipping)} away
            </span>
          </div>
          <div className="w-full bg-gold-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gold-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Add {formatINR(remainingForFreeShipping)} more to get free shipping!
          </p>
        </div>
      )}

      {subtotal >= SHIPPING_THRESHOLD && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">You've qualified for free shipping!</span>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Savings</span>
            <span>-{formatINR(totalSavings)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
        </div>
        <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="block w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center shadow-lg hover:shadow-xl"
        >
          Proceed to Checkout
        </Link>
      )}

      {/* Continue Shopping */}
      <Link
        href="/shop"
        className="block w-full text-center text-sm text-gray-600 hover:text-gold-600 mt-4 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
