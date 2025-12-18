import { getBestSellers } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';

export default function BestSellers() {
  const bestSellers = getBestSellers();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
          Bestsellers
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our most loved pieces, cherished by customers
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
