'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { categories } from '@/lib/data';

export default function Navbar() {
  const { totalQuantity } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Radiance
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gold-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 hover:text-gold-600 transition-colors"
            >
              Shop All
            </Link>
            {categories.slice(0, 3).map(category => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className="text-sm font-medium text-gray-700 hover:text-gold-600 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Cart</span>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex gap-2 overflow-x-auto">
          <Link
            href="/shop"
            className="text-xs font-medium text-gray-700 hover:text-gold-600 whitespace-nowrap px-3 py-1.5 rounded-full border border-gray-200 hover:border-gold-300 transition-colors"
          >
            Shop All
          </Link>
          {categories.map(category => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="text-xs font-medium text-gray-700 hover:text-gold-600 whitespace-nowrap px-3 py-1.5 rounded-full border border-gray-200 hover:border-gold-300 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
