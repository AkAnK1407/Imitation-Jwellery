import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import Price from './Price';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-shadow"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  tag === 'New'
                    ? 'bg-gold-500 text-white'
                    : 'bg-white/90 text-gray-900'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {product.stock < 5 && (
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gold-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <Price price={product.price} discountedPrice={product.discountedPrice} />
      </div>
    </Link>
  );
}
