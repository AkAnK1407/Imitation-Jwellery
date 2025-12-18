'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import ImageGallery from './ImageGallery';
import Price from './Price';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    product.variants?.forEach(v => {
      initial[v.type] = v.options[0];
    });
    return initial;
  });
  const [isAdded, setIsAdded] = useState(false);

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariant(prev => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <Price price={product.price} discountedPrice={product.discountedPrice} size="lg" />
            </div>

            {/* Material & Stock */}
            <div className="py-6 border-t border-b border-gray-100 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Material:</span> {product.material}
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Availability:</span>{' '}
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>

            {/* Description */}
            <div className="py-6">
              <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={Math.min(10, product.stock)}
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isAdded ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added to Cart
                </span>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </button>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Quality Assured
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Easy Returns
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Secure Checkout
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free Shipping*
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdded ? 'Added to Cart ✓' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </>
  );
}
