'use client';

import { useCart, SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';

export default function CheckoutSummary() {
  const { items, subtotal, totalSavings } = useCart();
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft sticky top-24">
      <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Order Items */}
      <div className="mb-6 space-y-3">
        {items.map((item, index) => (
          <div key={`${item.product.id}-${index}`} className="flex justify-between text-sm">
            <span className="text-gray-600 flex-1 mr-2">
              {item.product.name} × {item.quantity}
            </span>
            <span className="text-gray-900 font-medium">
              {formatINR((item.product.discountedPrice ?? item.product.price) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
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
    </div>
  );
}
