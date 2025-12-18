'use client';

import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';

interface FiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function Filters({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: FiltersProps) {
  const priceRanges: { label: string; range: [number, number] }[] = [
    { label: 'All', range: [0, 999999] },
    { label: 'Under ₹1,000', range: [0, 1000] },
    { label: '₹1,000 - ₹2,000', range: [1000, 2000] },
    { label: '₹2,000 - ₹3,500', range: [2000, 3500] },
    { label: 'Above ₹3,500', range: [3500, 999999] },
  ];

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('')}
            className={cn(
              'w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === ''
                ? 'bg-gold-100 text-gold-900'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                'w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-gold-100 text-gold-900'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filters */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => onPriceRangeChange(range.range)}
              className={cn(
                'w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                priceRange[0] === range.range[0] && priceRange[1] === range.range[1]
                  ? 'bg-gold-100 text-gold-900'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
