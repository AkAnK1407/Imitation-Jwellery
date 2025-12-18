import { Product, Category } from '@/lib/types';
import { getProductsByCategory } from '@/lib/data';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProduct: Product;
}

export default function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const relatedProducts = getProductsByCategory(currentProduct.category)
    .filter(p => p.id !== currentProduct.id)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
