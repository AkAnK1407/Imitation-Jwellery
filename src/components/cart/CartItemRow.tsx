'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { setQuantity, removeItem } = useCart();
  const price = item.product.discountedPrice ?? item.product.price;
  const total = price * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      {/* Product Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
      >
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.slug}`}
          className="font-medium text-gray-900 hover:text-gold-600 transition-colors line-clamp-2"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
        
        {/* Variants */}
        {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {Object.entries(item.selectedVariant)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </p>
        )}

        {/* Price & Quantity Controls */}
        <div className="flex items-center justify-between mt-3 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-900 w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => setQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
              disabled={item.quantity >= 10}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-900">{formatINR(total)}</p>
            {item.product.discountedPrice && (
              <p className="text-xs text-gray-400 line-through">{formatINR(item.product.price * item.quantity)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.product.id, item.selectedVariant)}
        className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
