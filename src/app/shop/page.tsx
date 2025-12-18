import { Suspense } from 'react';
import { Metadata } from 'next';
import ShopView from '@/components/shop/ShopView';
import ProductSkeletonCard from '@/components/product/ProductSkeletonCard';

export const metadata: Metadata = {
  title: 'Shop All Products - Radiance',
  description: 'Browse our complete collection of premium imitation jewellery. Necklaces, earrings, rings, bangles, and sets.',
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShopView />
    </Suspense>
  );
}
