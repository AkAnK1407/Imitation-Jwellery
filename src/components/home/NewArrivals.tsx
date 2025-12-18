import { getNewArrivals } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';

export default function NewArrivals() {
  const newArrivals = getNewArrivals();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
          New Arrivals
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Fresh designs just for you
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 sm:px-6 lg:px-8">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
